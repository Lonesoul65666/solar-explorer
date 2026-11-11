import * as THREE from 'three';

export interface DuskLaunchpadRig {
  group: THREE.Group;
  spawnLocalOffset: THREE.Vector3;
  upDir: THREE.Vector3;
  forwardDir: THREE.Vector3;
  update: (timeSec: number, earthRenderPos: THREE.Vector3, earthRadius: number, sunDir: THREE.Vector3) => void;
}

/**
 * Industrial Firefly/Expanse-style dusk launch gantry perched right on
 * Earth's sunset terminator so the cold open begins in warm tungsten twilight
 * beneath Earth's rotating 2K cloud deck (`r = 1.016 * R_earth`).
 */
export function createDuskLaunchpad(): DuskLaunchpadRig {
  const group = new THREE.Group();

  const matConcrete = new THREE.MeshStandardMaterial({
    color: 0x1e2530,
    roughness: 0.85,
    metalness: 0.35,
  });
  const matSteel = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.55,
    metalness: 0.75,
  });
  const matAmberLight = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
  const matCyanLight = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

  // Octagonal blast apron (scaled appropriate to Corvette ~0.22u length)
  const apron = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.56, 0.08, 8), matConcrete);
  apron.position.y = -0.04;
  group.add(apron);

  // Flame trench collar
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 8, 16), matSteel);
  collar.rotation.x = Math.PI * 0.5;
  collar.position.y = 0.01;
  group.add(collar);

  // Umbilical lattice tower beside the Corvette
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.52, 0.08), matSteel);
  tower.position.set(-0.24, 0.24, -0.06);
  group.add(tower);

  const swingArm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.025, 0.03), matSteel);
  swingArm.position.set(-0.14, 0.34, -0.02);
  group.add(swingArm);

  // Tungsten-amber perimeter flood beacons + cyan runway alignment pips
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + Math.PI * 0.25;
    const beacon = new THREE.Mesh(
      new THREE.BoxGeometry(0.03, 0.03, 0.03),
      i % 2 === 0 ? matAmberLight : matCyanLight,
    );
    beacon.position.set(Math.cos(a) * 0.4, 0.02, Math.sin(a) * 0.4);
    group.add(beacon);
  }

  const padLight = new THREE.PointLight(0xf59e0b, 1.8, 3.5, 1.5);
  padLight.position.set(-0.2, 0.42, 0.15);
  group.add(padLight);

  const upDir = new THREE.Vector3(0, 1, 0);
  const forwardDir = new THREE.Vector3(0, 0, 1);
  const spawnLocalOffset = new THREE.Vector3();
  const tmpRight = new THREE.Vector3();
  const rotMat = new THREE.Matrix4();

  return {
    group,
    spawnLocalOffset,
    upDir,
    forwardDir,
    update(timeSec: number, earthRenderPos: THREE.Vector3, earthRadius: number, sunDir: THREE.Vector3) {
      // Compute a surface normal right on the dusk terminator (dot(normal, sunDir) ~= 0.04)
      tmpRight.crossVectors(new THREE.Vector3(0, 1, 0), sunDir).normalize();
      if (tmpRight.lengthSq() < 0.01) tmpRight.set(0, 0, 1);

      upDir
        .copy(tmpRight)
        .multiplyScalar(0.96)
        .addScaledVector(sunDir, 0.05)
        .add(new THREE.Vector3(0, 0.26, 0))
        .normalize();

      // Forward points upward and slightly along the sunset horizon for dramatic ascent
      forwardDir.copy(upDir);
      const tangentZ = new THREE.Vector3().crossVectors(upDir, sunDir).normalize();
      const tangentX = new THREE.Vector3().crossVectors(upDir, tangentZ).normalize();

      rotMat.makeBasis(tangentX, upDir, tangentZ);
      group.quaternion.setFromRotationMatrix(rotMat);

      spawnLocalOffset.copy(upDir).multiplyScalar(earthRadius + 0.02);
      group.position.copy(earthRenderPos).add(spawnLocalOffset);

      padLight.intensity = 1.55 + Math.sin(timeSec * 4.2) * 0.25;
    },
  };
}
