import { StopId } from './store';
import { Vec3d, vec3d } from './FloatingOrigin';

/**
 * 1 Render Unit at Earth surface = 455.07 km (Earth radius = 14.0 units = 6,371 km).
 * Blend = 0 -> Tour Scale (scenic compressed orbits, dramatic solar disc).
 * Blend = 1 -> True Astronomical Scale (exact physical radii and AU ratios).
 */
export const KM_PER_UNIT = 6371.0 / 14.0;
export const AU_IN_KM = 149_597_870.7;

interface ScaleProfile {
  tourRadius: number;
  trueRadius: number;
  tourOrbit: number;
  trueOrbit: number;
  orbitAngle: number;
  inclinationY: number;
  parent?: StopId;
}

const PROFILES: Record<StopId, ScaleProfile> = {
  sun: {
    tourRadius: 42.0,
    trueRadius: 1528.8, // 109.2 * R_earth
    tourOrbit: 0,
    trueOrbit: 0,
    orbitAngle: 0,
    inclinationY: 0,
  },
  mercury: {
    tourRadius: 5.8,
    trueRadius: 5.36, // 0.3829 * R_earth
    tourOrbit: 145,
    trueOrbit: 127_106, // 0.3871 AU
    orbitAngle: 0.52,
    inclinationY: 2.2,
  },
  venus: {
    tourRadius: 13.3,
    trueRadius: 13.3, // 0.9499 * R_earth
    tourOrbit: 255,
    trueOrbit: 237_510, // 0.7233 AU
    orbitAngle: 1.24,
    inclinationY: -3.1,
  },
  earth: {
    tourRadius: 14.0,
    trueRadius: 14.0, // 1.000 R_earth
    tourOrbit: 390,
    trueOrbit: 328_370, // 1.000 AU
    orbitAngle: 2.05,
    inclinationY: 0,
  },
  moon: {
    tourRadius: 3.82,
    trueRadius: 3.82, // 0.2727 * R_earth
    tourOrbit: 52,
    trueOrbit: 844.6, // 60.33 * R_earth
    orbitAngle: 0.75,
    inclinationY: 2.4,
    parent: 'earth',
  },
};

function logLerp(a: number, b: number, t: number): number {
  if (a <= 0 || b <= 0) return a + (b - a) * t;
  return Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t);
}

export function getBodyRadiusUnits(id: StopId, scaleBlend: number): number {
  const p = PROFILES[id];
  return logLerp(p.tourRadius, p.trueRadius, scaleBlend);
}

export function getBodyHelioPos(id: StopId, scaleBlend: number, simTimeSec: number, out = vec3d()): Vec3d {
  if (id === 'sun') {
    out.x = 0; out.y = 0; out.z = 0;
    return out;
  }
  const p = PROFILES[id];
  const dist = logLerp(p.tourOrbit, p.trueOrbit, scaleBlend);
  const driftRate = id === 'moon' ? 0.012 : 0.00045;
  const ang = p.orbitAngle + simTimeSec * driftRate;

  if (p.parent) {
    const parentPos = getBodyHelioPos(p.parent, scaleBlend, simTimeSec, vec3d());
    out.x = parentPos.x + Math.cos(ang) * dist;
    out.y = parentPos.y + p.inclinationY * (1 + scaleBlend * 2);
    out.z = parentPos.z + Math.sin(ang) * dist;
    return out;
  }

  out.x = Math.cos(ang) * dist;
  out.y = p.inclinationY * (1 + scaleBlend * 4);
  out.z = Math.sin(ang) * dist;
  return out;
}
