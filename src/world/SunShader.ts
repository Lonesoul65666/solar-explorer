import * as THREE from 'three';

const SUN_VERT = /* glsl */ `
varying vec3 vNormalObj;
varying vec3 vNormalView;
varying vec3 vViewDir;

void main() {
  vNormalObj = normalize(position);
  vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
  vNormalView = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPos.xyz);
  gl_Position = projectionMatrix * mvPos;
}
`;

const SUN_FRAG = /* glsl */ `
uniform float uTime;
varying vec3 vNormalObj;
varying vec3 vNormalView;
varying vec3 vViewDir;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.07 + vec3(0.13, -0.17, 0.21);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec3 p = vNormalObj * 6.5;
  float q = fbm(p + vec3(uTime * 0.09, -uTime * 0.07, uTime * 0.05));
  float cells = fbm(p * 2.4 + vec3(q * 2.2 - uTime * 0.12));
  float flare = pow(clamp(fbm(p * 1.3 - vec3(uTime * 0.14)) * 1.35, 0.0, 1.0), 3.0);

  vec3 deepumbra = vec3(0.72, 0.18, 0.02);
  vec3 photosphere = vec3(1.0, 0.58, 0.08);
  vec3 hotCore = vec3(1.0, 0.96, 0.78);

  vec3 col = mix(deepumbra, photosphere, smoothstep(0.22, 0.68, cells));
  col = mix(col, hotCore, clamp(flare * 0.9 + pow(cells, 3.0) * 0.65, 0.0, 1.0));

  float ndv = clamp(dot(normalize(vNormalView), normalize(vViewDir)), 0.0, 1.0);
  float limbDark = pow(ndv, 0.42);
  float rimSpicule = pow(1.0 - ndv, 3.2) * 0.85;
  col = col * (0.48 + 0.65 * limbDark) + vec3(1.0, 0.45, 0.08) * rimSpicule;

  gl_FragColor = vec4(col * 1.25, 1.0);
}
`;

const CORONA_FRAG = /* glsl */ `
uniform float uTime;
varying vec3 vNormalObj;
varying vec3 vNormalView;
varying vec3 vViewDir;

void main() {
  float ndv = clamp(dot(normalize(vNormalView), normalize(vViewDir)), 0.0, 1.0);
  float radial = pow(ndv, 2.3) * pow(1.0 - ndv, 0.65) * 2.6;
  float rays = 0.78 + 0.22 * sin(vNormalObj.x * 14.0 + uTime * 0.9) * cos(vNormalObj.y * 11.0 - uTime * 0.7);
  float alpha = clamp(radial * rays, 0.0, 0.92);
  vec3 col = mix(vec3(0.96, 0.42, 0.04), vec3(1.0, 0.86, 0.48), pow(ndv, 1.8));
  gl_FragColor = vec4(col, alpha * 0.68);
}
`;

export interface SunVisualRig {
  group: THREE.Group;
  update: (timeSec: number) => void;
}

export function createSunRig(): SunVisualRig {
  const group = new THREE.Group();

  const surfaceMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: SUN_VERT,
    fragmentShader: SUN_FRAG,
  });
  const surfaceMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), surfaceMat);
  group.add(surfaceMesh);

  const coronaMat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: SUN_VERT,
    fragmentShader: CORONA_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const coronaMesh = new THREE.Mesh(new THREE.SphereGeometry(1.38, 48, 48), coronaMat);
  group.add(coronaMesh);

  return {
    group,
    update(timeSec: number) {
      surfaceMat.uniforms.uTime.value = timeSec;
      coronaMat.uniforms.uTime.value = timeSec;
      surfaceMesh.rotation.y = timeSec * 0.018;
    },
  };
}
