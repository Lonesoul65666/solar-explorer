import * as THREE from 'three';

export interface CorvetteDriveState {
  mainThrust: number;
  pitchTorque: number;
  yawTorque: number;
  rollTorque: number;
  radarFastSweep: boolean;
  dishTargetWorld?: THREE.Vector3;
}

type RcsAxis = 'pitchPos' | 'pitchNeg' | 'yawPos' | 'yawNeg';

/**
 * Multi-part industrial sci-fi Corvette (-Z forward, +Z aft, +Y dorsal).
 * `hullSlot` cleanly isolates the hull so an external `.glb` can drop in later.
 */
export class CorvetteMesh {
  public readonly group = new THREE.Group();
  public readonly hullSlot = new THREE.Group();

  private readonly plumePort: THREE.Group;
  private readonly plumeStarboard: THREE.Group;
  private readonly radiatorMat: THREE.MeshStandardMaterial;
  private readonly dishPivot = new THREE.Group();
  private readonly rcsPuffs: { mesh: THREE.Mesh; axis: RcsAxis }[] = [];
  private readonly localTargetTmp = new THREE.Vector3();

  constructor() {
    this.group.scale.setScalar(0.24);
    this.group.add(this.hullSlot);

    const gunmetal = new THREE.MeshStandardMaterial({
      color: 0x2b3440, metalness: 0.78, roughness: 0.42, flatShading: true,
    });
    const darkFrame = new THREE.MeshStandardMaterial({
      color: 0x161b22, metalness: 0.65, roughness: 0.58,
    });
    this.radiatorMat = new THREE.MeshStandardMaterial({
      color: 0x3b2618, emissive: 0xf59e0b, emissiveIntensity: 0.22, metalness: 0.5, roughness: 0.35,
    });
    const ventCyan = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const ventAmber = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

    const core = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.28, 1.55), gunmetal);
    const prow = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.82, 4), gunmetal);
    prow.rotation.set(-Math.PI * 0.5, Math.PI * 0.25, 0);
    prow.position.z = -1.15;
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 1.25), darkFrame);
    spine.position.set(0, 0.19, -0.08);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.035, 0.16), ventAmber);
    visor.position.set(0, 0.15, -0.78);
    this.hullSlot.add(core, prow, spine, visor);

    for (const s of [-1, 1]) {
      const sponson = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 1.12), gunmetal);
      sponson.position.set(s * 0.38, -0.02, 0.14);
      const cyanVent = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.04), ventCyan);
      cyanVent.position.set(s * 0.38, 0.06, -0.43);
      for (let r = 0; r < 3; r++) {
        const vane = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.02, 0.16), this.radiatorMat);
        vane.position.set(s * 0.62, 0.05 - r * 0.05, 0.02 + r * 0.22);
        vane.rotation.z = s * -0.28;
        this.hullSlot.add(vane);
      }
      const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 0.26, 10, 1, true), darkFrame);
      bell.rotation.x = Math.PI * 0.5;
      bell.position.set(s * 0.2, 0, 0.88);
      this.hullSlot.add(sponson, cyanVent, bell);
    }

    // Swiveling dorsal sensor dish
    this.dishPivot.position.set(0, 0.3, -0.22);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.12, 8), darkFrame);
    const dish = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 8, 0, Math.PI * 2, 0, 1.05), gunmetal);
    dish.rotation.x = -Math.PI * 0.65;
    dish.position.y = 0.09;
    const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.11, 6), ventCyan);
    feed.position.set(0, 0.13, -0.05);
    feed.rotation.x = 0.5;
    this.dishPivot.add(mast, dish, feed);
    this.group.add(this.dishPivot);

    const makePlume = (x: number): THREE.Group => {
      const g = new THREE.Group();
      g.position.set(x, 0, 0.98);
      const outer = new THREE.Mesh(
        new THREE.ConeGeometry(0.14, 1.35, 12, 1, true),
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8, transparent: true, opacity: 0.72,
          blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
        }),
      );
      outer.rotation.x = Math.PI * 0.5;
      outer.position.z = 0.66;
      const inner = new THREE.Mesh(
        new THREE.ConeGeometry(0.075, 0.72, 10),
        new THREE.MeshBasicMaterial({
          color: 0xe0f2fe, transparent: true, opacity: 0.95,
          blending: THREE.AdditiveBlending, depthWrite: false,
        }),
      );
      inner.rotation.x = Math.PI * 0.5;
      inner.position.z = 0.34;
      g.add(outer, inner);
      this.group.add(g);
      return g;
    };
    this.plumePort = makePlume(-0.2);
    this.plumeStarboard = makePlume(0.2);

    const puffGeo = new THREE.ConeGeometry(0.045, 0.28, 8);
    const puffs: [number, number, number, number, number, number, RcsAxis][] = [
      [0, -0.16, -0.95, Math.PI, 0, 0, 'pitchPos'],
      [0, 0.2, 0.68, 0, 0, 0, 'pitchPos'],
      [0, 0.18, -0.95, 0, 0, 0, 'pitchNeg'],
      [0, -0.18, 0.68, Math.PI, 0, 0, 'pitchNeg'],
      [0.26, 0, -0.88, 0, 0, -Math.PI * 0.5, 'yawPos'],
      [-0.48, 0, 0.62, 0, 0, Math.PI * 0.5, 'yawPos'],
      [-0.26, 0, -0.88, 0, 0, Math.PI * 0.5, 'yawNeg'],
      [0.48, 0, 0.62, 0, 0, -Math.PI * 0.5, 'yawNeg'],
    ];
    for (const [px, py, pz, rx, ry, rz, axis] of puffs) {
      const m = new THREE.Mesh(
        puffGeo,
        new THREE.MeshBasicMaterial({
          color: 0xbae6fd, transparent: true, opacity: 0,
          blending: THREE.AdditiveBlending, depthWrite: false,
        }),
      );
      m.position.set(px, py, pz);
      m.rotation.set(rx, ry, rz);
      this.group.add(m);
      this.rcsPuffs.push({ mesh: m, axis });
    }
  }

  public attachExternalHull(glbObject: THREE.Object3D): void {
    this.hullSlot.clear();
    this.hullSlot.add(glbObject);
  }

  public update(dt: number, timeSec: number, state: CorvetteDriveState): void {
    const t = Math.max(0, state.mainThrust);
    const vis = t > 0.02;
    this.plumePort.visible = vis;
    this.plumeStarboard.visible = vis;
    if (vis) {
      const sy = (0.35 + t * 1.15) * (0.92 + Math.sin(timeSec * 47) * 0.08);
      const sx = 0.75 + Math.min(0.6, t * 0.35);
      this.plumePort.scale.set(sx, sx, sy);
      this.plumeStarboard.scale.set(sx, sx, sy);
    }
    this.radiatorMat.emissiveIntensity = 0.16 + Math.min(0.95, t * 0.55);

    for (const p of this.rcsPuffs) {
      let s = 0;
      if (p.axis === 'pitchPos' && state.pitchTorque > 0.08) s = state.pitchTorque;
      if (p.axis === 'pitchNeg' && state.pitchTorque < -0.08) s = -state.pitchTorque;
      if (p.axis === 'yawPos' && state.yawTorque > 0.08) s = state.yawTorque;
      if (p.axis === 'yawNeg' && state.yawTorque < -0.08) s = -state.yawTorque;
      p.mesh.visible = s > 0.05;
      if (p.mesh.visible) {
        p.mesh.scale.set(0.85, (0.6 + s * 0.9) * (0.82 + Math.random() * 0.32), 0.85);
        (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(0.9, s * 0.85);
      }
    }

    if (state.radarFastSweep) {
      this.dishPivot.rotation.y += dt * 7.5;
    } else if (state.dishTargetWorld) {
      this.localTargetTmp.copy(state.dishTargetWorld);
      this.group.worldToLocal(this.localTargetTmp);
      const yaw = Math.atan2(-this.localTargetTmp.x, -this.localTargetTmp.z);
      this.dishPivot.rotation.y += (yaw - this.dishPivot.rotation.y) * Math.min(1, dt * 3.5);
    } else {
      this.dishPivot.rotation.y += dt * 0.65;
    }
  }
}
