import { FlightPhase, simStore, StopId } from '../core/store';
import { STOPS_DATA } from '../data/stopsData';

export interface HudCallbacks {
  onSelectStop: (stop: StopId) => void;
  onIgnitePad: () => void;
  onRadarPing: () => void;
  onReplaySagan: () => void;
  onToggleMute: (muted: boolean) => void;
}

const PHASE_LABELS: Record<FlightPhase, string> = {
  PAD: 'PAD STANDBY',
  ASCENT: 'CLOUD ASCENT',
  PULSE_JUMP: 'PULSE JUMP',
  FLIP_BURN: '180° FLIP & BURN',
  FREE_FLIGHT: 'ORBITAL CRUISE',
};

function fmtNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `${Math.round(n).toLocaleString()}`;
  if (n >= 100) return `${n.toFixed(0)}`;
  return `${n.toFixed(2)}`;
}

export class HudController {
  private readonly stopButtons: NodeListOf<HTMLButtonElement>;
  private readonly padBanner = document.getElementById('pad-banner') as HTMLButtonElement;
  private readonly telCode = document.getElementById('tel-stop-code')!;
  private readonly telPhase = document.getElementById('tel-phase-badge')!;
  private readonly telName = document.getElementById('tel-stop-name')!;
  private readonly telClass = document.getElementById('tel-stop-class')!;
  private readonly telAlt = document.getElementById('tel-alt')!;
  private readonly telVel = document.getElementById('tel-vel')!;
  private readonly telGload = document.getElementById('tel-gload')!;
  private readonly telZone = document.getElementById('tel-zone')!;
  private readonly telProBlock = document.getElementById('tel-pro-block')!;
  private readonly telAu = document.getElementById('tel-au')!;
  private readonly telGrav = document.getElementById('tel-grav')!;
  private readonly telTemp = document.getElementById('tel-temp')!;
  private readonly telShifts = document.getElementById('tel-shifts')!;
  private readonly telSummary = document.getElementById('tel-summary')!;
  private readonly quoteCard = document.getElementById('quote-card')!;
  private readonly quoteStop = document.getElementById('quote-stop')!;
  private readonly quoteText = document.getElementById('quote-text')!;
  private readonly quoteAttr = document.getElementById('quote-attr')!;
  private readonly probeBracket = document.getElementById('probe-bracket')!;
  private readonly probeCallout = this.probeBracket.querySelector('.probe-callout') as HTMLElement;
  private readonly probeStatus = document.getElementById('probe-status')!;
  private readonly probeDist = document.getElementById('probe-dist')!;
  private readonly probeName = document.getElementById('probe-name')!;
  private readonly probeMeta = document.getElementById('probe-meta')!;
  private readonly probeDesc = document.getElementById('probe-desc')!;
  private readonly captionsBar = document.getElementById('captions-bar')!;
  private readonly captionSpeaker = document.getElementById('caption-speaker')!;
  private readonly captionText = document.getElementById('caption-text')!;
  private readonly steerSvg = document.getElementById('steer-svg')!;
  private readonly steerOrigin = document.getElementById('steer-origin')!;
  private readonly steerLine = document.getElementById('steer-line')!;
  private readonly steerTip = document.getElementById('steer-tip')!;

  private lastQuoteKey = '';
  private quoteAgeSec = 0;

  constructor(cb: HudCallbacks) {
    this.stopButtons = document.querySelectorAll<HTMLButtonElement>('.stop-btn');
    this.stopButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const stop = btn.dataset.stop as StopId;
        if (stop) cb.onSelectStop(stop);
      });
    });

    this.padBanner.addEventListener('click', () => cb.onIgnitePad());

    const slider = document.getElementById('scale-slider') as HTMLInputElement;
    const scaleLabel = document.getElementById('scale-label')!;
    slider.addEventListener('input', () => {
      const blend = Number(slider.value) / 100;
      simStore.getState().setPatch({ scaleBlend: blend });
      scaleLabel.textContent =
        blend < 0.05 ? 'SCALE: TOUR' : blend > 0.95 ? 'SCALE: TRUE ASTRO' : `SCALE: ${Math.round(blend * 100)}%`;
    });

    const modeBtn = document.getElementById('btn-mode')!;
    modeBtn.addEventListener('click', () => {
      const next = simStore.getState().telemetryMode === 'EXPLORER' ? 'PRO' : 'EXPLORER';
      simStore.getState().setPatch({ telemetryMode: next });
      modeBtn.textContent = `MODE: ${next}`;
      this.telProBlock.classList.toggle('hidden', next !== 'PRO');
    });

    document.getElementById('btn-ping')!.addEventListener('click', () => cb.onRadarPing());
    document.getElementById('btn-sagan')!.addEventListener('click', () => cb.onReplaySagan());

    const muteBtn = document.getElementById('btn-mute')!;
    muteBtn.addEventListener('click', () => {
      const next = !simStore.getState().muted;
      simStore.getState().setPatch({ muted: next });
      muteBtn.textContent = next ? 'AUDIO: MUTED' : 'AUDIO: ON';
      cb.onToggleMute(next);
    });
  }

  public update(dt: number): void {
    const s = simStore.getState();
    const stopInfo = STOPS_DATA[s.activeStop];

    this.padBanner.classList.toggle('hidden', s.flightPhase !== 'PAD');
    this.telCode.textContent = stopInfo.code;
    this.telName.textContent = stopInfo.name;
    this.telClass.textContent = stopInfo.classification;
    this.telPhase.textContent = PHASE_LABELS[s.flightPhase];
    this.telPhase.classList.toggle('warn', s.flightPhase === 'FLIP_BURN' || s.audioZone === 'HAZARD_OVERRIDE');

    this.telAlt.textContent = `${fmtNum(s.altitudeKm)} km`;
    this.telVel.textContent =
      s.speedKms > 29979 ? `${(s.speedKms / 299_792.458).toFixed(2)} c` : `${fmtNum(s.speedKms)} km/s`;
    this.telGload.textContent = `${s.gLoad.toFixed(1)} G`;
    this.telZone.textContent = s.audioZone.replace('_', ' ');
    this.telSummary.textContent = stopInfo.explorerSummary;

    if (s.telemetryMode === 'PRO') {
      this.telAu.textContent = `${s.heliocentricAu.toFixed(4)} AU`;
      this.telGrav.textContent = `${stopInfo.gravityMs2} m/s² · ${stopInfo.escapeKms} km/s`;
      this.telTemp.textContent = `${stopInfo.meanTempK} K`;
      this.telShifts.textContent = `${s.originShifts}`;
    }

    this.stopButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.stop === s.activeStop);
    });

    if (s.activeQuote) {
      const qKey = s.activeQuote.stopName;
      if (qKey !== this.lastQuoteKey) {
        this.lastQuoteKey = qKey;
        this.quoteAgeSec = 0;
        this.quoteStop.textContent = s.activeQuote.stopName;
        this.quoteText.textContent = `“${s.activeQuote.text}”`;
        this.quoteAttr.textContent = `— ${s.activeQuote.author} · ${s.activeQuote.source}`;
      }
      this.quoteAgeSec += dt;
      this.quoteCard.classList.toggle('hidden', this.quoteAgeSec > 12.5);
    } else {
      this.quoteCard.classList.add('hidden');
    }

    if (s.nearestProbe) {
      const p = s.nearestProbe;
      this.probeBracket.classList.remove('hidden');
      this.probeBracket.style.transform = `translate3d(${p.screenX.toFixed(1)}px, ${p.screenY.toFixed(1)}px, 0)`;
      this.probeCallout.style.left = p.screenX > window.innerWidth - 300 ? '-284px' : '28px';
      this.probeStatus.textContent = p.status;
      this.probeDist.textContent = `${fmtNum(p.distKm)} km`;
      this.probeName.textContent = p.name;
      this.probeMeta.textContent = `${p.agency} · ${p.year}`;
      this.probeDesc.textContent = p.summary;
    } else {
      this.probeBracket.classList.add('hidden');
    }

    if (s.caption) {
      this.captionsBar.classList.remove('hidden');
      this.captionSpeaker.textContent = s.caption.speaker;
      this.captionText.textContent = s.caption.text;
    } else {
      this.captionsBar.classList.add('hidden');
    }

    const st = s.steeringUI;
    this.steerSvg.classList.toggle('active', st.active);
    if (st.active) {
      this.steerOrigin.setAttribute('cx', `${st.startX}`);
      this.steerOrigin.setAttribute('cy', `${st.startY}`);
      this.steerLine.setAttribute('x1', `${st.startX}`);
      this.steerLine.setAttribute('y1', `${st.startY}`);
      this.steerLine.setAttribute('x2', `${st.curX}`);
      this.steerLine.setAttribute('y2', `${st.curY}`);
      this.steerTip.setAttribute('cx', `${st.curX}`);
      this.steerTip.setAttribute('cy', `${st.curY}`);
    }
  }
}
