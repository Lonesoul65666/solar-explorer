import * as THREE from 'three';
import { ProbeArchetype } from '../data/probesData';

const MAT_GOLD = new THREE.MeshStandardMaterial({
  color: 0xd99b26,
  metalness: 0.88,
  roughness: 0.26,
});
const MAT_TITANIUM = new THREE.MeshStandardMaterial({
  color: 0x9aa5b4,
  metalness: 0.72,
  roughness: 0.36,
});
const MAT_CARBON = new THREE.MeshStandardMaterial({
  color: 0x1b2028,
  metalness: 0.35,
  roughness: 0.65,
});
const MAT_SOLAR = new THREE.MeshStandardMaterial({
  color: 0x153b6e,
  emissive: 0x071830,
  metalness: 0.55,
  roughness: 0.22,
});
const MAT_BEACON = new THREE.MeshBasicMaterial({
  color: 0x38bdf8,
  wireframe: true,
  transparent: true,
  opacity: 0.45,
});

export function createProbeMesh(archetype: ProbeArchetype): THREE.Group {
  const root = new THREE.Group();

  if (archetype === 'parker') {
    // Hexagonal thermal shield + gold bus + angled radiators + plasma whips
    const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.05, 6), MAT_CARBON);
    shield.rotation.x = Math.PI * 0.5;
    shield.position.z = 0.28;
    const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.48, 8), MAT_GOLD);
    bus.rotation.x = Math.PI * 0.5;
    const cup = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.32, 8), MAT_TITANIUM);
    cup.rotation.x = -Math.PI * 0.5;
    cup.position.z = -0.35;
    root.add(shield, bus, cup);
    for (const s of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.02, 0.14), MAT_SOLAR);
      wing.position.set(s * 0.26, 0, -0.18);
      wing.rotation.y = s * 0.35;
      root.add(wing);
    }
  } else if (archetype === 'bepicolombo') {
    const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.56, 8), MAT_TITANIUM);
    const mio = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.18, 8), MAT_GOLD);
    mio.position.y = 0.36;
    const dish = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 8, 0, Math.PI * 2, 0, 1.1), MAT_GOLD);
    dish.position.set(0, 0.12, 0.24);
    dish.rotation.x = 0.9;
    root.add(stack, mio, dish);
    for (const s of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.02, 0.2), MAT_SOLAR);
      wing.position.set(s * 0.56, -0.08, 0);
      root.add(wing);
    }
  } else if (archetype === 'venera13') {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 16), MAT_TITANIUM);
    const aeroRing = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.07, 16), MAT_GOLD);
    aeroRing.position.y = 0.12;
    const base = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 8, 16), MAT_CARBON);
    base.rotation.x = Math.PI * 0.5;
    base.position.y = -0.2;
    const helix = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.36, 8), MAT_TITANIUM);
    helix.position.y = 0.32;
    root.add(sphere, aeroRing, base, helix);
  } else if (archetype === 'iss') {
    const truss = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.05, 0.05), MAT_TITANIUM);
    const hab = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.65, 10), MAT_TITANIUM);
    hab.rotation.x = Math.PI * 0.5;
    root.add(truss, hab);
    for (const x of [-0.56, -0.38, 0.38, 0.56]) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.015, 0.72), MAT_GOLD);
      panel.position.set(x, 0, 0);
      root.add(panel);
    }
  } else {
    // JWST: 5-layer diamond sunshield + golden segmented primary mirror
    const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.04, 4), MAT_TITANIUM);
    shield.scale.set(1.35, 1, 0.85);
    shield.position.y = -0.14;
    const mirror = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.04, 6), MAT_GOLD);
    mirror.rotation.x = Math.PI * 0.5;
    mirror.position.y = 0.16;
    const boom = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.28, 3, 1, true), MAT_CARBON);
    boom.rotation.x = -Math.PI * 0.5;
    boom.position.set(0, 0.16, 0.16);
    root.add(shield, mirror, boom);
  }

  const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.68, 0), MAT_BEACON);
  beacon.name = 'sensorBeacon';
  root.add(beacon);

  return root;
}
