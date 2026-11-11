import * as THREE from 'three';
import { FloatingOrigin } from '../core/FloatingOrigin';
import { getBodyRadiusUnits } from '../core/ScaleManager';
import { StopId } from '../core/store';
import { SolarSystemScene } from '../world/SolarSystemScene';
import { FlightControlSample } from './InputRouter';

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);
const AXIS_Z = new THREE.Vector3(0, 0, 1);

/**
 * Handles Corvette manual free-flight attitude dynamics, auto-leveling horizon,
 * planetary safety cushion, and Dual-Scale proportional altitude preservation.
 */
export class FlightPhysics {
  private pitchVel = 0;
  private yawVel = 0;
  private bankAngle = 0;
  private readonly rightTmp = new THREE.Vector3();
  private readonly upTmp = new THREE.Vector3();
  private readonly fwdTmp = new THREE.Vector3();
  private readonly relTmp = new THREE.Vector3();
  private readonly matTmp = new THREE.Matrix4();
  private readonly qTmp = new THREE.Quaternion();

  public alignQuatAlong(forward: THREE.Vector3, outQuat: THREE.Quaternion, upRef = WORLD_UP): void {
    this.rightTmp.crossVectors(forward, upRef);
    if (this.rightTmp.lengthSq() < 0.001) this.rightTmp.set(1, 0, 0);
    this.rightTmp.normalize();
    this.upTmp.crossVectors(this.rightTmp, forward).normalize();
    this.matTmp.makeBasis(this.rightTmp, this.upTmp, forward.clone().negate());
    outQuat.setFromRotationMatrix(this.matTmp);
  }

  public stepFreeFlight(
    dt: number,
    ctrl: FlightControlSample,
    shipPos: THREE.Vector3,
    flightQuat: THREE.Quaternion,
    hullQuat: THREE.Quaternion,
    curSpeed: number,
    activeStop: StopId,
    scaleBlend: number,
    solar: SolarSystemScene,
    origin: FloatingOrigin,
  ): number {
    this.pitchVel += (ctrl.pitch * 1.45 - this.pitchVel) * Math.min(1, dt * 7.5);
    this.yawVel += (ctrl.yaw * 1.55 - this.yawVel) * Math.min(1, dt * 7.5);

    this.qTmp.setFromAxisAngle(AXIS_Y, this.yawVel * dt);
    flightQuat.multiply(this.qTmp);
    this.qTmp.setFromAxisAngle(AXIS_X, this.pitchVel * dt);
    flightQuat.multiply(this.qTmp);

    // Auto-level horizon unless user applies manual Q/E roll
    this.fwdTmp.set(0, 0, -1).applyQuaternion(flightQuat).normalize();
    if (Math.abs(ctrl.roll) > 0.05) {
      this.qTmp.setFromAxisAngle(AXIS_Z, ctrl.roll * 1.6 * dt);
      flightQuat.multiply(this.qTmp);
    } else if (Math.abs(this.fwdTmp.y) < 0.94) {
      this.alignQuatAlong(this.fwdTmp, flightQuat);
    }
    flightQuat.normalize();

    this.bankAngle += (ctrl.yaw * 0.34 - this.bankAngle) * Math.min(1, dt * 6);
    this.qTmp.setFromAxisAngle(AXIS_Z, this.bankAngle);
    hullQuat.copy(flightQuat).multiply(this.qTmp);

    const targetSpeed = ctrl.boost ? 7.8 : Math.abs(ctrl.pitch) + Math.abs(ctrl.yaw) > 0.05 ? 2.4 : 0.85;
    const nextSpeed = curSpeed + (targetSpeed - curSpeed) * Math.min(1, dt * 3.8);
    shipPos.addScaledVector(this.fwdTmp, nextSpeed * dt);

    // Keep ship safely above planetary photosphere / crust
    const activePos = solar.bodyRenderPos[activeStop];
    const minR = getBodyRadiusUnits(activeStop, scaleBlend) * 1.045;
    this.relTmp.copy(shipPos).sub(activePos);
    if (this.relTmp.length() < minR) {
      if (this.relTmp.lengthSq() < 0.0001) this.relTmp.set(0, 0, 1);
      shipPos.copy(activePos).add(this.relTmp.normalize().multiplyScalar(minR));
    }

    origin.keepShipNearOrigin(shipPos);
    return nextSpeed;
  }

  public rescaleShipAroundActiveStop(
    activeStop: StopId,
    oldBlend: number,
    newBlend: number,
    shipPos: THREE.Vector3,
    solar: SolarSystemScene,
    origin: FloatingOrigin,
  ): void {
    const oldR = getBodyRadiusUnits(activeStop, oldBlend);
    const newR = getBodyRadiusUnits(activeStop, newBlend);
    const rel = shipPos.clone().sub(solar.bodyRenderPos[activeStop]);
    origin.setOrigin(solar.bodyHelio[activeStop]);
    shipPos.copy(rel.multiplyScalar(newR / Math.max(0.01, oldR)));
  }
}
