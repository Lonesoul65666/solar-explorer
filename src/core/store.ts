import { createStore } from 'zustand/vanilla';

export type StopId = 'sun' | 'mercury' | 'venus' | 'earth' | 'moon';
export type FlightPhase = 'PAD' | 'ASCENT' | 'PULSE_JUMP' | 'FLIP_BURN' | 'FREE_FLIGHT';
export type AudioZone = 'PAD' | 'ASCENT' | 'VOID_DRIFT' | 'HAZARD_OVERRIDE';
export type TelemetryMode = 'EXPLORER' | 'PRO';

export interface ProbeHudInfo {
  id: string;
  name: string;
  agency: string;
  year: string;
  status: string;
  summary: string;
  distKm: number;
  screenX: number;
  screenY: number;
}

export interface QuoteCardInfo {
  stopName: string;
  text: string;
  author: string;
  source: string;
}

export interface CaptionInfo {
  speaker: string;
  text: string;
}

export interface SteeringVectorUI {
  active: boolean;
  startX: number;
  startY: number;
  curX: number;
  curY: number;
}

export interface SimState {
  flightPhase: FlightPhase;
  audioZone: AudioZone;
  activeStop: StopId;
  jumpTarget: StopId | null;
  jumpProgress: number;
  scaleBlend: number; // 0 = Tour Scale, 1 = True Astronomical Scale
  telemetryMode: TelemetryMode;
  speedKms: number;
  gLoad: number;
  altitudeKm: number;
  heliocentricAu: number;
  originShifts: number;
  boostActive: boolean;
  radarPingAge: number;
  muted: boolean;
  commsPlaying: boolean;
  nearestProbe: ProbeHudInfo | null;
  activeQuote: QuoteCardInfo | null;
  caption: CaptionInfo | null;
  steeringUI: SteeringVectorUI;
  setPatch: (patch: Partial<SimState>) => void;
}

export const simStore = createStore<SimState>((set) => ({
  flightPhase: 'PAD',
  audioZone: 'PAD',
  activeStop: 'earth',
  jumpTarget: null,
  jumpProgress: 0,
  scaleBlend: 0,
  telemetryMode: 'EXPLORER',
  speedKms: 0,
  gLoad: 1.0,
  altitudeKm: 0.12,
  heliocentricAu: 1.0,
  originShifts: 0,
  boostActive: false,
  radarPingAge: 999,
  muted: false,
  commsPlaying: false,
  nearestProbe: null,
  activeQuote: null,
  caption: null,
  steeringUI: { active: false, startX: 0, startY: 0, curX: 0, curY: 0 },
  setPatch: (patch) => set(patch),
}));
