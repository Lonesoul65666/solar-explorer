import * as THREE from 'three';

const EARTH_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const EARTH_FRAG = /* glsl */ `
uniform sampler2D uDayMap;
uniform sampler2D uNightMap;
uniform sampler2D uNormalMap;
uniform sampler2D uSpecMap;
uniform vec3 uSunDir;

varying vec2 vUv;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
  vec3 baseN = normalize(vWorldNormal);
  vec3 nSample = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
  vec3 pertN = normalize(baseN + vec3(nSample.x, nSample.y, 0.0) * 0.28);

  vec3 sunDir = normalize(uSunDir);
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float ndl = dot(pertN, sunDir);
  float rawNdl = dot(baseN, sunDir);

  vec3 dayCol = texture2D(uDayMap, vUv).rgb;
  vec3 nightCol = texture2D(uNightMap, vUv).rgb;
  float specMask = texture2D(uSpecMap, vUv).r;

  float dayMix = smoothstep(-0.14, 0.22, rawNdl);
  float diffuse = max(ndl, 0.0);

  // Warm tungsten-amber sunset scatter band right along the terminator
  float twilight = exp(-pow((rawNdl + 0.02) * 7.5, 2.0));
  vec3 duskGlow = vec3(0.96, 0.52, 0.16) * twilight * 0.36;

  // Ocean glint
  vec3 halfVec = normalize(sunDir + viewDir);
  float spec = pow(max(dot(pertN, halfVec), 0.0), 42.0) * specMask * smoothstep(-0.02, 0.25, rawNdl);
  vec3 oceanSpec = vec3(0.65, 0.84, 1.0) * spec * 0.55;

  // Night city lights shine through dark side with warm amber boost
  vec3 cityGlow = pow(nightCol, vec3(1.25)) * vec3(1.35, 0.98, 0.58) * (1.0 - smoothstep(-0.18, 0.08, rawNdl)) * 1.45;

  // Fresnel cyan limb scatter
  float fresnel = pow(1.0 - max(dot(baseN, viewDir), 0.0), 3.6);
  vec3 limb = vec3(0.22, 0.74, 0.98) * fresnel * smoothstep(-0.28, 0.45, rawNdl) * 0.52;

  vec3 litDay = dayCol * (0.06 + 0.98 * diffuse) * dayMix;
  gl_FragColor = vec4(litDay + cityGlow + duskGlow + oceanSpec + limb, 1.0);
}
`;

const CLOUD_FRAG = /* glsl */ `
uniform sampler2D uCloudMap;
uniform vec3 uSunDir;
varying vec2 vUv;
varying vec3 vWorldNormal;

void main() {
  float c = texture2D(uCloudMap, vUv).r;
  float ndl = dot(normalize(vWorldNormal), normalize(uSunDir));
  float lit = smoothstep(-0.22, 0.28, ndl);
  float dusk = exp(-pow((ndl + 0.03) * 7.0, 2.0));
  vec3 col = mix(vec3(0.04, 0.06, 0.10), vec3(0.98, 0.99, 1.0), lit);
  col += vec3(0.96, 0.56, 0.20) * dusk * 0.45;
  gl_FragColor = vec4(col, smoothstep(0.08, 0.88, c) * 0.82);
}
`;

const ATMO_FRAG = /* glsl */ `
uniform vec3 uSunDir;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
  vec3 n = normalize(vWorldNormal);
  vec3 v = normalize(cameraPosition - vWorldPos);
  float rim = pow(1.0 - abs(dot(n, v)), 3.2);
  float sunFacing = smoothstep(-0.35, 0.55, dot(n, normalize(uSunDir)));
  vec3 col = mix(vec3(0.96, 0.52, 0.16), vec3(0.22, 0.74, 0.98), smoothstep(-0.1, 0.35, dot(n, normalize(uSunDir))));
  gl_FragColor = vec4(col, rim * sunFacing * 0.62);
}
`;

export interface EarthVisualRig {
  group: THREE.Group;
  surfaceSpinGroup: THREE.Group;
  update: (dt: number, sunDirWorld: THREE.Vector3) => void;
}

export function createEarthRig(loader: THREE.TextureLoader): EarthVisualRig {
  const group = new THREE.Group();
  const tiltGroup = new THREE.Group();
  tiltGroup.rotation.z = THREE.MathUtils.degToRad(23.44);
  group.add(tiltGroup);

  const surfaceSpinGroup = new THREE.Group();
  tiltGroup.add(surfaceSpinGroup);

  const loadTex = (url: string, srgb = true): THREE.Texture => {
    const t = loader.load(url);
    t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.anisotropy = 4;
    return t;
  };

  const sunDirUniform = { value: new THREE.Vector3(-1, 0, 0) };
  const earthMat = new THREE.ShaderMaterial({
    uniforms: {
      uDayMap: { value: loadTex('./textures/2k_earth_daymap.jpg', true) },
      uNightMap: { value: loadTex('./textures/2k_earth_nightmap.jpg', true) },
      uNormalMap: { value: loadTex('./textures/earth_normal.jpg', false) },
      uSpecMap: { value: loadTex('./textures/earth_spec.jpg', false) },
      uSunDir: sunDirUniform,
    },
    vertexShader: EARTH_VERT,
    fragmentShader: EARTH_FRAG,
  });
  surfaceSpinGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), earthMat));

  const cloudMat = new THREE.ShaderMaterial({
    uniforms: {
      uCloudMap: { value: loadTex('./textures/2k_earth_clouds.jpg', false) },
      uSunDir: sunDirUniform,
    },
    vertexShader: EARTH_VERT,
    fragmentShader: CLOUD_FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.016, 64, 64), cloudMat);
  tiltGroup.add(cloudMesh);

  const atmoMat = new THREE.ShaderMaterial({
    uniforms: { uSunDir: sunDirUniform },
    vertexShader: EARTH_VERT,
    fragmentShader: ATMO_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  });
  tiltGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.055, 48, 48), atmoMat));

  return {
    group,
    surfaceSpinGroup,
    update(dt: number, sunDirWorld: THREE.Vector3) {
      sunDirUniform.value.copy(sunDirWorld);
      surfaceSpinGroup.rotation.y += dt * 0.012;
      cloudMesh.rotation.y += dt * 0.0165;
    },
  };
}
