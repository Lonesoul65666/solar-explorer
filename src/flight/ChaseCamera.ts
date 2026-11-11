import * as THREE from 'three';

/**
 * Third-person spring-damped chase camera with zoom-through nose visor mode.
 * Follows `flightFrameQuat` (trajectory attitude) so during a 180-degree
 * Expanse flip-and-burn the player watches the Corvette whip nose-for-tail
 * right in front of the lens while still facing the approaching planet!
 */
export class ChaseCamera {
  private readonly smoothedOffset = new THREE.Vector3(0, 0.42, 2.35);
  private readonly smoothedQuat = new THREE.Quaternion();
  private initialized = false;

  private readonly desiredOffset = new THREE.Vector3();
  private readonly lookTarget = new THREE.Vector3();
  private readonly upVec = new THREE.Vector3();
  private readonly forwardVec = new THREE.Vector3();

  public update(
    camera: THREE.PerspectiveCamera,
    corvetteGroup: THREE.Group,
    shipPos: THREE.Vector3,
    flightFrameQuat: THREE.Quaternion,
    zoomDistance: number,
    gShakeIntensity: number,
    dt: number,
    timeSec: number,
  ): void {
    if (!this.initialized) {
      this.smoothedQuat.copy(flightFrameQuat);
      this.initialized = true;
    } else {
      this.smoothedQuat.slerp(flightFrameQuat, Math.min(1, dt * 8.5));
    }

    // Zoom-through: zooming closer than 0.68 smoothly transitions through prow into nose visor
    const noseVisorMode = zoomDistance < 0.68;
    corvetteGroup.visible = !noseVisorMode;

    if (noseVisorMode) {
      this.desiredOffset.set(0, 0.04, -0.22).applyQuaternion(this.smoothedQuat);
      this.smoothedOffset.lerp(this.desiredOffset, Math.min(1, dt * 16));
    } else {
      const lift = 0.16 + zoomDistance * 0.16;
      this.desiredOffset.set(0, lift, zoomDistance).applyQuaternion(this.smoothedQuat);
      this.smoothedOffset.lerp(this.desiredOffset, Math.min(1, dt * 12));
    }

    camera.position.copy(shipPos).add(this.smoothedOffset);

    if (gShakeIntensity > 0.02) {
      const amp = gShakeIntensity * 0.016;
      camera.position.x += Math.sin(timeSec * 53.0) * amp;
      camera.position.y += Math.cos(timeSec * 61.0) * amp;
    }

    this.forwardVec.set(0, 0, -1).applyQuaternion(this.smoothedQuat);
    this.upVec.set(0, 1, 0).applyQuaternion(this.smoothedQuat);
    this.lookTarget.copy(shipPos).addScaledVector(this.forwardVec, 12.0);

    camera.up.copy(this.upVec);
    camera.lookAt(this.lookTarget);
  }
}
