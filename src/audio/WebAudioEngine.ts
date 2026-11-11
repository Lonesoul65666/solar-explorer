import { AudioZone } from '../core/store';

interface ZoneBus {
  gain: GainNode;
}

/**
 * 4-Zone Web Audio crossfader (`PAD`, `ASCENT`, `VOID_DRIFT`, `HAZARD_OVERRIDE`)
 * + procedural hull-conducted thruster rumble, RCS gas puffs, radar sonar ping,
 * and automatic Comms ducking. Zero external audio libs, zero Web Speech TTS.
 */
export class WebAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private duckGain: GainNode | null = null;
  private rumbleGain: GainNode | null = null;
  private rumbleFilter: BiquadFilterNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private zones: Record<AudioZone, ZoneBus> | null = null;
  private muted = false;
  private ducked = false;
  private lastRcsBurstAt = 0;

  public unlock(): void {
    if (!this.ctx) this.buildGraph();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private buildGraph(): void {
    const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    const ctx = new AudioCtor();
    this.ctx = ctx;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : 0.78;
    this.masterGain.connect(ctx.destination);

    this.duckGain = ctx.createGain();
    this.duckGain.gain.value = this.ducked ? 0.22 : 1.0;
    this.duckGain.connect(this.masterGain);

    // Generate 2s brown-pink noise buffer for hull-conducted rumble, wind, and RCS puffs
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.04 * white) / 1.04;
      data[i] = last * 2.8;
    }
    this.noiseBuffer = buf;

    const makeZone = (freqs: number[], type: OscillatorType, cutoff: number, lfoHz = 0): ZoneBus => {
      const g = ctx.createGain();
      g.gain.value = 0.0001;
      const filt = ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = cutoff;
      filt.connect(g);
      g.connect(this.duckGain!);

      for (const f of freqs) {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = f;
        const og = ctx.createGain();
        og.gain.value = 0.14 / freqs.length;
        osc.connect(og);
        og.connect(filt);
        osc.start();
      }
      if (lfoHz > 0) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = lfoHz;
        lfoGain.gain.value = cutoff * 0.45;
        lfo.connect(lfoGain);
        lfoGain.connect(filt.frequency);
        lfo.start();
      }
      return { gain: g };
    };

    // Dusk wind layer on PAD
    const padBus = makeZone([55.0, 110.3], 'triangle', 210, 0.12);
    const windSrc = ctx.createBufferSource();
    windSrc.buffer = buf;
    windSrc.loop = true;
    const windFilt = ctx.createBiquadFilter();
    windFilt.type = 'bandpass';
    windFilt.frequency.value = 260;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.16;
    windSrc.connect(windFilt);
    windFilt.connect(windGain);
    windGain.connect(padBus.gain);
    windSrc.start();

    this.zones = {
      PAD: padBus,
      ASCENT: makeZone([110.0, 164.81, 220.5], 'sawtooth', 460, 0.35),
      VOID_DRIFT: makeZone([73.42, 110.0, 164.81, 174.61], 'sine', 340, 0.08),
      HAZARD_OVERRIDE: makeZone([48.99, 98.0, 146.83], 'sawtooth', 380, 2.1),
    };

    // Hull-conducted thruster rumble (noise + 38 Hz hull resonance)
    const rumbleSrc = ctx.createBufferSource();
    rumbleSrc.buffer = buf;
    rumbleSrc.loop = true;
    this.rumbleFilter = ctx.createBiquadFilter();
    this.rumbleFilter.type = 'lowpass';
    this.rumbleFilter.frequency.value = 95;
    this.rumbleGain = ctx.createGain();
    this.rumbleGain.gain.value = 0.0001;

    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.value = 39;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.22;

    rumbleSrc.connect(this.rumbleFilter);
    subOsc.connect(subGain);
    subGain.connect(this.rumbleFilter);
    this.rumbleFilter.connect(this.rumbleGain);
    this.rumbleGain.connect(this.duckGain);
    rumbleSrc.start();
    subOsc.start();
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.78, this.ctx.currentTime, 0.08);
    }
  }

  public setCommsDuck(ducked: boolean): void {
    this.ducked = ducked;
    if (this.ctx && this.duckGain) {
      this.duckGain.gain.setTargetAtTime(ducked ? 0.22 : 1.0, this.ctx.currentTime, 0.18);
    }
  }

  public triggerRadarPingSound(): void {
    if (!this.ctx || !this.masterGain || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.exponentialRampToValueAtTime(1480.0, now + 0.12);
    g.gain.setValueAtTime(0.16, now);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.85);
    osc.connect(g);
    g.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.9);
  }

  public update(activeZone: AudioZone, mainThrust: number, rcsMagnitude: number): void {
    if (!this.ctx || !this.zones || !this.rumbleGain || !this.rumbleFilter) return;
    const now = this.ctx.currentTime;
    for (const key of ['PAD', 'ASCENT', 'VOID_DRIFT', 'HAZARD_OVERRIDE'] as AudioZone[]) {
      const target = key === activeZone ? 0.85 : 0.0001;
      this.zones[key].gain.gain.setTargetAtTime(target, now, 0.42);
    }
    const thrustClamped = Math.max(0, Math.min(1.5, mainThrust));
    this.rumbleGain.gain.setTargetAtTime(thrustClamped * 0.34, now, 0.08);
    this.rumbleFilter.frequency.setTargetAtTime(80 + thrustClamped * 190, now, 0.1);

    if (rcsMagnitude > 0.35 && now - this.lastRcsBurstAt > 0.22 && this.noiseBuffer && this.duckGain) {
      this.lastRcsBurstAt = now;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuffer;
      const hp = this.ctx.createBiquadFilter();
      hp.type = 'bandpass';
      hp.frequency.value = 1450;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.055, now);
      g.gain.exponentialRampToValueAtTime(0.0005, now + 0.09);
      src.connect(hp);
      hp.connect(g);
      g.connect(this.duckGain);
      src.start(now, Math.random() * 1.2, 0.1);
    }
  }
}
