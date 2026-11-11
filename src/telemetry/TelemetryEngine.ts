import * as THREE from 'three';
import { distVec3d, FloatingOrigin, vec3d } from '../core/FloatingOrigin';
import { getBodyRadiusUnits, KM_PER_UNIT } from '../core/ScaleManager';
import { AudioZone, ProbeHudInfo, simStore } from '../core/store';
import { STOPS_DATA } from '../data/stopsData';
import { ActiveProbeInstance, SolarSystemScene } from '../world/SolarSystemScene';

export class TelemetryEngine {
  private readonly shipHelioTmp = vec3d();
  private readonly projTmp = new THREE.Vector3();

  public update(
    dt: number,
    shipRenderPos: THREE.Vector3,
    camera: THREE.PerspectiveCamera,
    solar: SolarSystemScene,
    origin: FloatingOrigin,
     radarPingTriggered: boolean,
  ): THREE.Vector3 | undefined {
    const st = simStore.getState();
    const nextPingAge = radarPingTriggered ? 0 : Math.min(999, st.radarPingAge + dt);

    origin.renderToHelio(shipRenderPos, this.shipHelioTmp);
    const activeBodyHelio = solar.bodyHelio[st.activeStop];
    const bodyRadiusUnits = getBodyRadiusUnits(st.activeStop, st.scaleBlend);
    const centerDistUnits = distVec3d(this.shipHelioTmp, activeBodyHelio);
    const altUnits = Math.max(0.00025, centerDistUnits - bodyRadiusUnits);
    const altitudeKm = st.flightPhase === 'PAD' ? 0.12 : altUnits * KM_PER_UNIT;

    // 4-zone audio state determination
    let audioZone: AudioZone = 'VOID_DRIFT';
    if (st.flightPhase === 'PAD') {
      audioZone = 'PAD';
    } else if (st.flightPhase === 'ASCENT') {
      audioZone = 'ASCENT';
    } else {
      const hazardFactor = STOPS_DATA[st.activeStop].hazardRadiusFactor;
      const inSolarOrAtmoHazard = hazardFactor !== undefined && centerDistUnits < bodyRadiusUnits * hazardFactor;
      if (st.flightPhase === 'FLIP_BURN' || inSolarOrAtmoHazard) {
        audioZone = 'HAZARD_OVERRIDE';
      }
    }

    // Closest historic probe detection + 2D holographic bracket projection
    let bestProbe: ActiveProbeInstance | null = null;
    let bestDistUnits = Infinity;
    for (const p of solar.probes) {
      if (p.spec.hostStop !== st.activeStop) continue;
      const d = p.renderPos.distanceTo(shipRenderPos);
      if (d < bestDistUnits) {
        bestDistUnits = d;
        bestProbe = p;
      }
    }

    const pingBoost = nextPingAge < 6.0 ? 2.6 : 1.0;
    const detectRange = Math.max(18, bodyRadiusUnits * 2.15) * pingBoost;
    let nearestProbe: ProbeHudInfo | null = null;
    let dishTargetWorld: THREE.Vector3 | undefined;

    if (bestProbe && st.flightPhase === 'FREE_FLIGHT') {
      dishTargetWorld = bestProbe.renderPos;
      if (bestDistUnits <= detectRange) {
        this.projTmp.copy(bestProbe.renderPos).project(camera);
        if (this.projTmp.z > -1 && this.projTmp.z < 1) {
          const sx = (this.projTmp.x * 0.5 + 0.5) * window.innerWidth;
          const sy = (-this.projTmp.y * 0.5 + 0.5) * window.innerHeight;
          if (sx >= 24 && sx <= window.innerWidth - 24 && sy >= 24 && sy <= window.innerHeight - 64) {
            nearestProbe = {
              id: bestProbe.spec.id,
              name: bestProbe.spec.name,
              agency: bestProbe.spec.agency,
              year: bestProbe.spec.year,
              status: bestProbe.spec.status,
              summary: bestProbe.spec.summary,
              distKm: bestDistUnits * KM_PER_UNIT,
              screenX: sx,
              screenY: sy,
            };
          }
        }
      }
    }

    st.setPatch({
      altitudeKm,
      audioZone,
      radarPingAge: nextPingAge,
      nearestProbe,
    });

    return dishTargetWorld;
  }
}
