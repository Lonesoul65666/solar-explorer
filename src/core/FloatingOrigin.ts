import * as THREE from 'three';

export interface Vec3d {
  x: number;
  y: number;
  z: number;
}

export function vec3d(x = 0, y = 0, z = 0): Vec3d {
  return { x, y, z };
}

export function copyVec3d(dst: Vec3d, src: Vec3d): Vec3d {
  dst.x = src.x;
  dst.y = src.y;
  dst.z = src.z;
  return dst;
}

export function distVec3d(a: Vec3d, b: Vec3d): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.hypot(dx, dy, dz);
}

/**
 * Double-precision Floating-Origin coordinate manager.
 * Keeps the active celestial stop or ship neighborhood anchored near (0,0,0)
 * in Float32 WebGL render space so vertex positions never jitter even at 1 AU.
 */
export class FloatingOrigin {
  public readonly originHelio: Vec3d = vec3d(0, 0, 0);
  public shiftCount = 0;
  private readonly driftThreshold: number;

  constructor(driftThreshold = 2500) {
    this.driftThreshold = driftThreshold;
  }

  /** Re-centers render origin directly onto a heliocentric coordinate. */
  public setOrigin(newOrigin: Vec3d, shipRenderPos?: THREE.Vector3): void {
    if (shipRenderPos) {
      shipRenderPos.x += this.originHelio.x - newOrigin.x;
      shipRenderPos.y += this.originHelio.y - newOrigin.y;
      shipRenderPos.z += this.originHelio.z - newOrigin.z;
    }
    copyVec3d(this.originHelio, newOrigin);
    this.shiftCount += 1;
  }

  /** Shifts floating origin if ship drifts beyond threshold in free flight. */
  public keepShipNearOrigin(shipRenderPos: THREE.Vector3): boolean {
    if (shipRenderPos.lengthSq() < this.driftThreshold * this.driftThreshold) {
      return false;
    }
    this.originHelio.x += shipRenderPos.x;
    this.originHelio.y += shipRenderPos.y;
    this.originHelio.z += shipRenderPos.z;
    shipRenderPos.set(0, 0, 0);
    this.shiftCount += 1;
    return true;
  }

  /** Converts a double-precision heliocentric coordinate into Float32 render space. */
  public helioToRender(helio: Vec3d, out: THREE.Vector3): THREE.Vector3 {
    return out.set(
      helio.x - this.originHelio.x,
      helio.y - this.originHelio.y,
      helio.z - this.originHelio.z,
    );
  }

  /** Computes the ship's exact double-precision heliocentric coordinate. */
  public renderToHelio(renderPos: THREE.Vector3, out: Vec3d): Vec3d {
    out.x = this.originHelio.x + renderPos.x;
    out.y = this.originHelio.y + renderPos.y;
    out.z = this.originHelio.z + renderPos.z;
    return out;
  }
}
