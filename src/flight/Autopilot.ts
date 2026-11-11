import * as THREE from 'three';
import { FloatingOrigin, vec3d } from '../core/FloatingOrigin';
import { AU_IN_KM, getBodyRadiusUnits, KM_PER_UNIT } from '../core/ScaleManager';
import { simStore, StopId } from '../core/store';
import { STOPS_DATA } from '../data/stopsData';
import { SolarSystemScene } from '../world/SolarSystemScene';
import { FlightPhysics } from './FlightPhysics';
import { FlightControlSample } from './InputRouter';

export interface FlightStepOutput {
  mainThrust: number;
  pitchTorque: number;
  yawTorque: number;
  rollTorque: number;
  streakIntensity: number;
  gShake: number;
}

export class Autopilot {
  public readonly shipPos = new THREE.Vector3();
  public readonly flightQuat = new THREE.Quaternion();
  public readonly hullQuat = new THREE.Quaternion();
  public readonly physics = new FlightPhysics();

  private phaseTimer = 0;
  private speedUnitsPerSec = 0;
  private jumpDest: StopId = 'sun';
  private lastScaleBlend = 0;
  private readonly jumpStartPos = new THREE.Vector3();
  private readonly jumpGatePos = new THREE.Vector3();
  private readonly orbitStopPos = new THREE.Vector3();
  private readonly flipQuat = new THREE.Quaternion();
  private readonly shipHelioTmp = vec3d();
  private readonly fwdTmp = new THREE.Vector3();

  public onLaunchIgnited?: () => void;
  public onStopArrived?: (stop: StopId) => void;

  public snapToLaunchpad(solar: SolarSystemScene, origin: FloatingOrigin): void {
    origin.setOrigin(solar.bodyHelio.earth);
    this.shipPos.copy(solar.launchpad.group.position).addScaledVector(solar.launchpad.upDir, 0.08);
    this.fwdTmp
      .copy(solar.launchpad.upDir)
      .multiplyScalar(0.84)
      .addScaledVector(new THREE.Vector3(0, 1, 0), 0.35)
      .normalize();
    this.physics.alignQuatAlong(this.fwdTmp, this.flightQuat, solar.launchpad.upDir);
    this.hullQuat.copy(this.flightQuat);
  }

  public igniteLaunch(): void {
    if (simStore.getState().flightPhase !== 'PAD') return;
    this.phaseTimer = 0;
    simStore.getState().setPatch({ flightPhase: 'ASCENT', audioZone: 'ASCENT', activeQuote: null });
    this.onLaunchIgnited?.();
  }

  public engageJump(target: StopId, solar: SolarSystemScene, origin: FloatingOrigin, scaleBlend: number): void {
    if (simStore.getState().flightPhase === 'PULSE_JUMP') return;
    this.jumpDest = target;
    this.phaseTimer = 0;

    origin.setOrigin(solar.bodyHelio[target]);
    const destRadius = getBodyRadiusUnits(target, scaleBlend);
    const orbitDist = destRadius * STOPS_DATA[target].arrivalDistanceRadii;

    const sunRender = origin.helioToRender(solar.bodyHelio.sun, new THREE.Vector3());
    const toSun = target === 'sun' ? new THREE.Vector3(0.35, 0.14, 0.92).normalize() : sunRender.normalize();
    const side = new THREE.Vector3(-toSun.z, 0.16, toSun.x).normalize();
    const approachDir = toSun.multiplyScalar(0.55).addScaledVector(side, 0.82).normalize();

    this.orbitStopPos.copy(approachDir).multiplyScalar(orbitDist);
    this.jumpGatePos.copy(approachDir).multiplyScalar(orbitDist + Math.max(12, destRadius * 0.65));
    this.jumpStartPos.copy(approachDir).multiplyScalar(orbitDist + Math.max(95, destRadius * 3.4));
    this.shipPos.copy(this.jumpStartPos);

    this.physics.alignQuatAlong(this.orbitStopPos.clone().sub(this.jumpStartPos).normalize(), this.flightQuat);
    this.hullQuat.copy(this.flightQuat);

    simStore.getState().setPatch({
      flightPhase: 'PULSE_JUMP',
      audioZone: 'VOID_DRIFT',
      activeStop: target,
      jumpTarget: target,
      jumpProgress: 0,
      activeQuote: null,
    });
  }

  public update(dt: number, ctrl: FlightControlSample, solar: SolarSystemScene, origin: FloatingOrigin): FlightStepOutput {
    const st = simStore.getState();
    if (Math.abs(st.scaleBlend - this.lastScaleBlend) > 0.0005) {
      if (st.flightPhase === 'FREE_FLIGHT') {
        this.physics.rescaleShipAroundActiveStop(st.activeStop, this.lastScaleBlend, st.scaleBlend, this.shipPos, solar, origin);
      }
      this.lastScaleBlend = st.scaleBlend;
    }

    let mainThrust = 0;
    let pitchTorque = 0;
    let yawTorque = 0;
    let streakIntensity = 0;
    let gShake = 0;
    let gLoad = 1.0;

    if (st.flightPhase === 'PAD') {
      this.snapToLaunchpad(solar, origin);
      if (ctrl.consumeSpaceTrigger) this.igniteLaunch();
      return { mainThrust: 0, pitchTorque: 0, yawTorque: 0, rollTorque: 0, streakIntensity: 0, gShake: 0 };
    }

    if (st.flightPhase === 'ASCENT') {
      this.phaseTimer += dt;
      const p = Math.min(1, this.phaseTimer / 5.8);
      mainThrust = 1.35;
      gShake = 0.75 * (1 - p * 0.35);
      gLoad = 2.4 + p * 1.4;
      this.speedUnitsPerSec = 0.32 + p * p * 3.8;
      this.fwdTmp.set(0, 0, -1).applyQuaternion(this.flightQuat);
      this.shipPos.addScaledVector(this.fwdTmp, this.speedUnitsPerSec * dt);
      this.flightQuat.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -dt * 0.08)).normalize();
      this.hullQuat.copy(this.flightQuat);
      if (this.phaseTimer >= 5.8) this.engageJump('sun', solar, origin, st.scaleBlend);
    } else if (st.flightPhase === 'PULSE_JUMP') {
      this.phaseTimer += dt;
      const p = Math.min(1, this.phaseTimer / 4.0);
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      this.shipPos.lerpVectors(this.jumpStartPos, this.jumpGatePos, ease);
      streakIntensity = Math.sin(p * Math.PI);
      mainThrust = 1.45;
      gShake = streakIntensity * 0.45;
      gLoad = 1.8 + streakIntensity * 1.6;
      this.speedUnitsPerSec = 180 + streakIntensity * 38_000;
      this.hullQuat.copy(this.flightQuat);
      st.setPatch({ jumpProgress: p });
      if (p >= 1) {
        this.phaseTimer = 0;
        st.setPatch({ flightPhase: 'FLIP_BURN' });
      }
    } else if (st.flightPhase === 'FLIP_BURN') {
      this.phaseTimer += dt;
      const p = Math.min(1, this.phaseTimer / 2.5);
      this.shipPos.lerpVectors(this.jumpGatePos, this.orbitStopPos, 1 - Math.pow(1 - p, 2.4));
      let flip = 0;
      if (p < 0.26) {
        const fp = p / 0.26;
        flip = THREE.MathUtils.smoothstep(fp, 0, 1) * Math.PI;
        yawTorque = fp < 0.5 ? 1 : -1;
      } else if (p < 0.8) {
        flip = Math.PI;
        mainThrust = 1.5;
        gShake = 0.85;
        gLoad = 4.2;
      } else {
        const bp = (p - 0.8) / 0.2;
        flip = (1 - THREE.MathUtils.smoothstep(bp, 0, 1)) * Math.PI;
        yawTorque = bp < 0.5 ? -1 : 1;
      }
      this.flipQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), flip);
      this.hullQuat.copy(this.flightQuat).multiply(this.flipQuat);
      this.speedUnitsPerSec = (1 - p) * 42 + 0.4;
      if (p >= 1) {
        this.hullQuat.copy(this.flightQuat);
        this.speedUnitsPerSec = 0.45;
        const arrived = this.jumpDest;
        st.setPatch({ flightPhase: 'FREE_FLIGHT', jumpTarget: null, activeQuote: STOPS_DATA[arrived].quote });
        this.onStopArrived?.(arrived);
      }
    } else {
      pitchTorque = ctrl.pitch;
      yawTorque = ctrl.yaw;
      this.speedUnitsPerSec = this.physics.stepFreeFlight(
        dt, ctrl, this.shipPos, this.flightQuat, this.hullQuat,
        this.speedUnitsPerSec, st.activeStop, st.scaleBlend, solar, origin,
      );
      mainThrust = ctrl.boost ? 1.35 : 0.32;
      gShake = ctrl.boost ? 0.25 : 0;
      gLoad = ctrl.boost ? 2.6 : 1.0;
    }

    origin.renderToHelio(this.shipPos, this.shipHelioTmp);
    const helioUnits = Math.hypot(this.shipHelioTmp.x, this.shipHelioTmp.y, this.shipHelioTmp.z);
    st.setPatch({
      speedKms: this.speedUnitsPerSec * KM_PER_UNIT,
      gLoad,
      boostActive: ctrl.boost && st.flightPhase === 'FREE_FLIGHT',
      heliocentricAu: (helioUnits * KM_PER_UNIT) / AU_IN_KM,
      originShifts: origin.shiftCount,
    });

    return { mainThrust, pitchTorque, yawTorque, rollTorque: ctrl.roll, streakIntensity, gShake };
  }
}
