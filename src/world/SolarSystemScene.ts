import * as THREE from 'three';
import { FloatingOrigin, Vec3d, vec3d } from '../core/FloatingOrigin';
import { getBodyHelioPos, getBodyRadiusUnits } from '../core/ScaleManager';
import { StopId } from '../core/store';
import { STOPS_ORDER } from '../data/stopsData';
import { PROBES_DATA, ProbeSpec } from '../data/probesData';
import { createSunRig, SunVisualRig } from './SunShader';
import { createEarthRig, EarthVisualRig } from './EarthShader';
import { createProbeMesh } from './ProbeMeshes';
import { createDuskLaunchpad, DuskLaunchpadRig } from './LaunchpadScene';

export interface ActiveProbeInstance {
  spec: ProbeSpec;
  mesh: THREE.Group;
  helioPos: Vec3d;
  renderPos: THREE.Vector3;
}

const MAX_HORIZON_DIST = 30_000;

export class SolarSystemScene {
  public readonly bodyHelio: Record<StopId, Vec3d> = {
    sun: vec3d(), mercury: vec3d(), venus: vec3d(), earth: vec3d(), moon: vec3d(),
  };
  public readonly bodyRenderPos: Record<StopId, THREE.Vector3> = {
    sun: new THREE.Vector3(), mercury: new THREE.Vector3(), venus: new THREE.Vector3(),
    earth: new THREE.Vector3(), moon: new THREE.Vector3(),
  };
  public readonly probes: ActiveProbeInstance[] = [];
  public readonly launchpad: DuskLaunchpadRig;
  public readonly sunLight: THREE.DirectionalLight;

  private readonly bodyGroups: Record<StopId, THREE.Group>;
  private readonly sunRig: SunVisualRig;
  private readonly earthRig: EarthVisualRig;
  private readonly ribbonAttr: THREE.BufferAttribute;
  private readonly ribbonAnchors = STOPS_ORDER.map(() => new THREE.Vector3());
  private readonly ribbonCurve: THREE.CatmullRomCurve3;
  private readonly sunDirTmp = new THREE.Vector3(1, 0, 0);
  private readonly earthSunDirTmp = new THREE.Vector3(1, 0, 0);
  private readonly tmpVec = new THREE.Vector3();

  constructor(scene: THREE.Scene) {
    const loader = new THREE.TextureLoader();
    scene.add(new THREE.HemisphereLight(0x38bdf8, 0x0b101d, 0.24));

    this.sunLight = new THREE.DirectionalLight(0xfff4e0, 2.8);
    scene.add(this.sunLight, this.sunLight.target);

    this.sunRig = createSunRig();
    this.earthRig = createEarthRig(loader);

    const makePlanet = (texPath: string, tiltDeg: number, rimHex?: number): THREE.Group => {
      const g = new THREE.Group();
      const tex = loader.load(texPath);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(1, 56, 56),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.86, metalness: 0.05 }),
      );
      m.rotation.z = THREE.MathUtils.degToRad(tiltDeg);
      g.add(m);
      if (rimHex !== undefined) {
        g.add(new THREE.Mesh(
          new THREE.SphereGeometry(1.035, 40, 40),
          new THREE.MeshBasicMaterial({
            color: rimHex, transparent: true, opacity: 0.16,
            side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
          }),
        ));
      }
      return g;
    };

    this.bodyGroups = {
      sun: this.sunRig.group,
      mercury: makePlanet('./textures/2k_mercury.jpg', 0.03),
      venus: makePlanet('./textures/2k_venus_atmosphere.jpg', 177.3, 0xf59e0b),
      earth: this.earthRig.group,
      moon: makePlanet('./textures/moon.jpg', 6.68),
    };
    for (const id of STOPS_ORDER) scene.add(this.bodyGroups[id]);

    const ribbonGeo = new THREE.BufferGeometry();
    this.ribbonAttr = new THREE.BufferAttribute(new Float32Array(97 * 3), 3);
    ribbonGeo.setAttribute('position', this.ribbonAttr);
    this.ribbonCurve = new THREE.CatmullRomCurve3(this.ribbonAnchors);
    const tourRibbon = new THREE.Line(
      ribbonGeo,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.26, depthWrite: false }),
    );
    tourRibbon.frustumCulled = false;
    scene.add(tourRibbon);

    for (const spec of PROBES_DATA) {
      const mesh = createProbeMesh(spec.id);
      mesh.scale.setScalar(0.32);
      scene.add(mesh);
      this.probes.push({ spec, mesh, helioPos: vec3d(), renderPos: new THREE.Vector3() });
    }

    this.launchpad = createDuskLaunchpad();
    scene.add(this.launchpad.group);
  }

  public update(
    simTimeSec: number,
    dt: number,
    scaleBlend: number,
    floatingOrigin: FloatingOrigin,
    shipRenderPos: THREE.Vector3,
  ): void {
    for (const id of STOPS_ORDER) {
      getBodyHelioPos(id, scaleBlend, simTimeSec, this.bodyHelio[id]);
      const rUnits = getBodyRadiusUnits(id, scaleBlend);
      const renderPos = floatingOrigin.helioToRender(this.bodyHelio[id], this.bodyRenderPos[id]);
      const distFromShip = renderPos.distanceTo(shipRenderPos);
      const grp = this.bodyGroups[id];
      if (distFromShip > MAX_HORIZON_DIST) {
        const factor = MAX_HORIZON_DIST / distFromShip;
        this.tmpVec.copy(renderPos).sub(shipRenderPos);
        grp.position.copy(shipRenderPos).addScaledVector(this.tmpVec, factor);
        grp.scale.setScalar(rUnits * factor);
      } else {
        grp.position.copy(renderPos);
        grp.scale.setScalar(rUnits);
      }
    }

    this.sunDirTmp.copy(this.bodyRenderPos.sun).sub(shipRenderPos);
    if (this.sunDirTmp.lengthSq() < 0.0001) this.sunDirTmp.set(1, 0.2, 0);
    this.sunDirTmp.normalize();
    this.sunLight.position.copy(shipRenderPos).addScaledVector(this.sunDirTmp, 400);
    this.sunLight.target.position.copy(shipRenderPos);

    this.earthSunDirTmp.copy(this.bodyRenderPos.sun).sub(this.bodyRenderPos.earth).normalize();
    this.sunRig.update(simTimeSec);
    this.earthRig.update(dt, this.earthSunDirTmp);
    this.bodyGroups.mercury.children[0].rotation.y += dt * 0.004;
    this.bodyGroups.venus.children[0].rotation.y -= dt * 0.003;
    this.bodyGroups.moon.children[0].rotation.y += dt * 0.006;

    const earthRadius = getBodyRadiusUnits('earth', scaleBlend);
    this.launchpad.update(simTimeSec, this.bodyGroups.earth.position, earthRadius, this.earthSunDirTmp);

    for (const p of this.probes) {
      const hostHelio = this.bodyHelio[p.spec.hostStop];
      const orbitR = getBodyRadiusUnits(p.spec.hostStop, scaleBlend) * p.spec.orbitRadiusFactor;
      const a = p.spec.initialPhase + simTimeSec * p.spec.orbitSpeed;
      p.helioPos.x = hostHelio.x + Math.cos(a) * orbitR;
      p.helioPos.y = hostHelio.y + Math.sin(a * 0.8) * orbitR * p.spec.orbitInclination;
      p.helioPos.z = hostHelio.z + Math.sin(a) * orbitR;
      floatingOrigin.helioToRender(p.helioPos, p.renderPos);
      p.mesh.position.copy(p.renderPos);
      p.mesh.visible = p.renderPos.distanceTo(shipRenderPos) < 9000;
      p.mesh.rotation.y = -a + Math.PI * 0.5;
      const beacon = p.mesh.getObjectByName('sensorBeacon');
      if (beacon) beacon.rotation.y += dt * 1.4;
    }

    for (let i = 0; i < STOPS_ORDER.length; i++) {
      this.ribbonAnchors[i].copy(this.bodyGroups[STOPS_ORDER[i]].position);
    }
    for (let i = 0; i <= 96; i++) {
      this.ribbonCurve.getPoint(i / 96, this.tmpVec);
      this.ribbonAttr.setXYZ(i, this.tmpVec.x, this.tmpVec.y, this.tmpVec.z);
    }
    this.ribbonAttr.needsUpdate = true;
  }
}
