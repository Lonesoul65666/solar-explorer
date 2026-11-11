import * as THREE from 'three';

export interface SpaceEffectsRig {
  update: (
    cameraPos: THREE.Vector3,
    shipPos: THREE.Vector3,
    shipQuat: THREE.Quaternion,
    streakIntensity: number,
    pingAgeSec: number,
    dt: number,
  ) => void;
}

export function createStarfieldAndStreak(scene: THREE.Scene): SpaceEffectsRig {
  // 1. Deep-space spectral starfield centered on camera (immune to floating-origin shifts)
  const starCount = 4200;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  const palette = [
    new THREE.Color(0xdbeafe),
    new THREE.Color(0xfef3c7),
    new THREE.Color(0x93c5fd),
    new THREE.Color(0xfde68a),
    new THREE.Color(0xffffff),
  ];

  for (let i = 0; i < starCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = 42000 + Math.random() * 8000;
    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
    const c = palette[i % palette.length];
    const b = 0.45 + Math.random() * 0.55;
    starColors[i * 3] = c.r * b;
    starColors[i * 3 + 1] = c.g * b;
    starColors[i * 3 + 2] = c.b * b;
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
  const starMat = new THREE.PointsMaterial({
    size: 85,
    vertexColors: true,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const starPoints = new THREE.Points(starGeo, starMat);
  starPoints.frustumCulled = false;
  scene.add(starPoints);

  // 2. 4-second Pulse Jump star-streak tunnel around the Corvette
  const streakCount = 320;
  const streakSeeds = new Float32Array(streakCount * 3);
  const streakPos = new Float32Array(streakCount * 6);
  for (let i = 0; i < streakCount; i++) {
    const ang = Math.random() * Math.PI * 2;
    const rad = 0.65 + Math.random() * 6.5;
    streakSeeds[i * 3] = Math.cos(ang) * rad;
    streakSeeds[i * 3 + 1] = Math.sin(ang) * rad;
    streakSeeds[i * 3 + 2] = (Math.random() - 0.5) * 44;
  }
  const streakGeo = new THREE.BufferGeometry();
  const streakAttr = new THREE.BufferAttribute(streakPos, 3);
  streakGeo.setAttribute('position', streakAttr);
  const streakMat = new THREE.LineBasicMaterial({
    color: 0x7dd3fc,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const streakLines = new THREE.LineSegments(streakGeo, streakMat);
  streakLines.visible = false;
  scene.add(streakLines);

  // 3. Expanding cyan tactical Radar Ping shell ([Enter])
  const pingMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    wireframe: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const pingSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), pingMat);
  pingSphere.visible = false;
  scene.add(pingSphere);

  return {
    update(cameraPos, shipPos, shipQuat, streakIntensity, pingAgeSec, dt) {
      starPoints.position.copy(cameraPos);

      if (streakIntensity > 0.01) {
        streakLines.visible = true;
        streakLines.position.copy(shipPos);
        streakLines.quaternion.copy(shipQuat);
        streakMat.opacity = Math.min(0.9, streakIntensity * 0.88);
        const len = 0.4 + streakIntensity * 9.5;
        const speed = 18 + streakIntensity * 95;
        for (let i = 0; i < streakCount; i++) {
          let z = streakSeeds[i * 3 + 2] - speed * dt;
          if (z < -22) z += 44;
          streakSeeds[i * 3 + 2] = z;
          const x = streakSeeds[i * 3];
          const y = streakSeeds[i * 3 + 1];
          const idx = i * 6;
          streakPos[idx] = x;
          streakPos[idx + 1] = y;
          streakPos[idx + 2] = z;
          streakPos[idx + 3] = x;
          streakPos[idx + 4] = y;
          streakPos[idx + 5] = z + len;
        }
        streakAttr.needsUpdate = true;
      } else {
        streakLines.visible = false;
      }

      if (pingAgeSec < 2.2) {
        pingSphere.visible = true;
        pingSphere.position.copy(shipPos);
        const p = pingAgeSec / 2.2;
        pingSphere.scale.setScalar(0.3 + p * 46);
        pingMat.opacity = (1 - p) * 0.42;
      } else {
        pingSphere.visible = false;
      }
    },
  };
}
