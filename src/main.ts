import './ui/hudBase.css';
import './ui/hudPanels.css';
import './ui/sensorBar.css';

import * as THREE from 'three';
import { CommsPlayer } from './audio/CommsPlayer';
import { WebAudioEngine } from './audio/WebAudioEngine';
import { FloatingOrigin } from './core/FloatingOrigin';
import { simStore, StopId } from './core/store';
import { Autopilot } from './flight/Autopilot';
import { ChaseCamera } from './flight/ChaseCamera';
import { CorvetteMesh } from './flight/CorvetteMesh';
import { InputRouter } from './flight/InputRouter';
import { TelemetryEngine } from './telemetry/TelemetryEngine';
import { HudController } from './ui/HudController';
import { SolarSystemScene } from './world/SolarSystemScene';
import { createStarfieldAndStreak } from './world/StarfieldAndStreak';

const viewportEl = document.getElementById('viewport')!;

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
viewportEl.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05080f);

const camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.04, 65_000);

const floatingOrigin = new FloatingOrigin(2500);
const solarScene = new SolarSystemScene(scene);
const spaceFx = createStarfieldAndStreak(scene);

const corvette = new CorvetteMesh();
scene.add(corvette.group);

const inputRouter = new InputRouter(viewportEl);
const chaseCamera = new ChaseCamera();
const autopilot = new Autopilot();
const telemetry = new TelemetryEngine();
const audioEngine = new WebAudioEngine();
const comms = new CommsPlayer(audioEngine);

// Unlock Web Audio cleanly on first pointer or keyboard gesture
const unlockOnce = () => audioEngine.unlock();
window.addEventListener('pointerdown', unlockOnce, { passive: true });
window.addEventListener('keydown', unlockOnce, { passive: true });

autopilot.onLaunchIgnited = () => {
  audioEngine.unlock();
  comms.playLaunchWelcome();
};

autopilot.onStopArrived = (stop: StopId) => {
  if (stop === 'sun' || stop === 'earth') {
    comms.playSaganBroadcast(false);
  }
};

// Initialize world transforms & snap Corvette to Earth dusk launchpad cold open
solarScene.update(0, 0.016, 0, floatingOrigin, autopilot.shipPos);
autopilot.snapToLaunchpad(solarScene, floatingOrigin);
solarScene.update(0, 0.016, 0, floatingOrigin, autopilot.shipPos);

const hud = new HudController({
  onSelectStop: (stop) => {
    audioEngine.unlock();
    autopilot.engageJump(stop, solarScene, floatingOrigin, simStore.getState().scaleBlend);
  },
  onIgnitePad: () => {
    audioEngine.unlock();
    autopilot.igniteLaunch();
  },
  onRadarPing: () => {
    audioEngine.unlock();
    inputRouter.triggerRadarPing();
  },
  onReplaySagan: () => {
    audioEngine.unlock();
    comms.playSaganBroadcast(true);
  },
  onToggleMute: (muted) => {
    audioEngine.setMuted(muted);
    comms.setMuted(muted);
  },
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let lastTimeMs = performance.now();
let simTimeSec = 0;

function animate(nowMs: number): void {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, Math.max(0.001, (nowMs - lastTimeMs) * 0.001));
  lastTimeMs = nowMs;
  simTimeSec += dt;

  const ctrl = inputRouter.sample();
  if (ctrl.consumeRadarPing) {
    audioEngine.triggerRadarPingSound();
  }

  const state = simStore.getState();
  solarScene.update(simTimeSec, dt, state.scaleBlend, floatingOrigin, autopilot.shipPos);

  const stepOut = autopilot.update(dt, ctrl, solarScene, floatingOrigin);
  // Refresh local scene positions if Autopilot re-anchored FloatingOrigin mid-frame
  solarScene.update(simTimeSec, 0, state.scaleBlend, floatingOrigin, autopilot.shipPos);

  corvette.group.position.copy(autopilot.shipPos);
  corvette.group.quaternion.copy(autopilot.hullQuat);

  chaseCamera.update(
    camera,
    corvette.group,
    autopilot.shipPos,
    autopilot.flightQuat,
    ctrl.zoomDistance,
    stepOut.gShake,
    dt,
    simTimeSec,
  );

  const dishTarget = telemetry.update(
    dt,
    autopilot.shipPos,
    camera,
    solarScene,
    floatingOrigin,
    ctrl.consumeRadarPing,
  );

  const updatedState = simStore.getState();
  corvette.update(dt, simTimeSec, {
    mainThrust: stepOut.mainThrust,
    pitchTorque: stepOut.pitchTorque,
    yawTorque: stepOut.yawTorque,
    rollTorque: stepOut.rollTorque,
    radarFastSweep: updatedState.radarPingAge < 2.2,
    dishTargetWorld: dishTarget,
  });

  spaceFx.update(
    camera.position,
    autopilot.shipPos,
    autopilot.flightQuat,
    stepOut.streakIntensity,
    updatedState.radarPingAge,
    dt,
  );

  const rcsMag = Math.max(Math.abs(stepOut.pitchTorque), Math.abs(stepOut.yawTorque));
  audioEngine.update(updatedState.audioZone, stepOut.mainThrust, rcsMag);
  comms.update(dt);
  hud.update(dt);

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);
