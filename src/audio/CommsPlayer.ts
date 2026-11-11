import { simStore } from '../core/store';
import { SAGAN_REAL_CAPTIONS, SHIP_WELCOME_CAPTIONS, SyncedCaptionLine } from '../data/captionsData';
import { WebAudioEngine } from './WebAudioEngine';

type TrackKind = 'welcome' | 'sagan';

/**
 * Plays mastered ship/archival audio files (`public/audio/ship-welcome.mp3` &
 * `public/audio/sagan-real.mp3`) with auto-ducking and verbatim classroom captions.
 * Strictly zero browser `window.speechSynthesis` TTS.
 */
export class CommsPlayer {
  private currentAudio: HTMLAudioElement | null = null;
  private activeLines: SyncedCaptionLine[] = [];
  private activeSpeaker = '';
  private fallbackTimer = 0;
  private fallbackDuration = 0;
  private usingFallbackClock = false;
  private saganAutoPlayed = false;

  constructor(private readonly audioEngine: WebAudioEngine) {}

  public playLaunchWelcome(): void {
    this.startTrack('welcome', './audio/ship-welcome.mp3', 'ODYSSEY FLIGHT COMMS', SHIP_WELCOME_CAPTIONS, 13.85);
  }

  public playSaganBroadcast(force = false): void {
    if (this.saganAutoPlayed && !force) return;
    this.saganAutoPlayed = true;
    this.startTrack('sagan', './audio/sagan-real.mp3', 'CARL SAGAN · PALE BLUE DOT', SAGAN_REAL_CAPTIONS, 42.0);
  }

  private startTrack(
    _kind: TrackKind,
    src: string,
    speaker: string,
    lines: SyncedCaptionLine[],
    expectedDur: number,
  ): void {
    this.stop();
    this.activeLines = lines;
    this.activeSpeaker = speaker;
    this.fallbackTimer = 0;
    this.fallbackDuration = expectedDur;
    this.usingFallbackClock = false;

    const el = new Audio(src);
    el.preload = 'auto';
    el.volume = simStore.getState().muted ? 0 : 0.96;
    this.currentAudio = el;

    this.audioEngine.setCommsDuck(true);
    simStore.getState().setPatch({ commsPlaying: true });

    el.addEventListener('ended', () => {
      if (this.currentAudio === el) this.stop();
    });

    el.play().catch(() => {
      // If autoplay or headless browser blocks media playback, still run synced classroom captions!
      this.usingFallbackClock = true;
    });
  }

  public setMuted(muted: boolean): void {
    if (this.currentAudio) {
      this.currentAudio.volume = muted ? 0 : 0.96;
    }
  }

  public stop(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
      } catch {
        // ignore pause errors
      }
      this.currentAudio = null;
    }
    this.activeLines = [];
    this.usingFallbackClock = false;
    this.audioEngine.setCommsDuck(false);
    simStore.getState().setPatch({ commsPlaying: false, caption: null });
  }

  public update(dt: number): void {
    if (!this.activeLines.length) return;

    let t = 0;
    if (this.usingFallbackClock) {
      this.fallbackTimer += dt;
      t = this.fallbackTimer;
      if (t >= this.fallbackDuration) {
        this.stop();
        return;
      }
    } else if (this.currentAudio) {
      t = this.currentAudio.currentTime;
    } else {
      return;
    }

    let matchedText: string | null = null;
    for (const cue of this.activeLines) {
      if (t >= cue.t0 && t <= cue.t1) {
        matchedText = cue.text;
        break;
      }
    }

    const curCaption = simStore.getState().caption;
    if (matchedText) {
      if (!curCaption || curCaption.text !== matchedText) {
        simStore.getState().setPatch({
          caption: { speaker: this.activeSpeaker, text: matchedText },
        });
      }
    } else if (curCaption !== null) {
      simStore.getState().setPatch({ caption: null });
    }
  }
}
