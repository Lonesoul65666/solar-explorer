import { simStore } from '../core/store';

export interface FlightControlSample {
  pitch: number; // -1..1 (+1 = nose up)
  yaw: number; // -1..1 (+1 = nose left)
  roll: number; // -1..1 (hidden Q/E trim)
  boost: boolean;
  consumeSpaceTrigger: boolean;
  consumeRadarPing: boolean;
  zoomDistance: number;
}

/**
 * Chromebook-proof flight input router:
 * - Arrow keys (pitch/yaw) + Spacebar (ignition / boost) + Enter (radar ping)
 * - 1-finger click/touch-drag steering vector on viewport
 * - Scroll/pinch zoom-through chase camera
 * - Hidden WASD/QE + W3C Gamepad support
 */
export class InputRouter {
  private readonly keys = new Set<string>();
  private spaceQueued = false;
  private pingQueued = false;
  private gamepadPingLatch = false;
  private pointerId: number | null = null;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragCurX = 0;
  private dragCurY = 0;
  private zoomDist = 2.35;

  constructor(viewportEl: HTMLElement) {
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      if (!this.keys.has(e.code)) {
        if (e.code === 'Space') this.spaceQueued = true;
        if (e.code === 'Enter' || e.code === 'NumpadEnter') this.pingQueued = true;
      }
      this.keys.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });

    window.addEventListener('blur', () => {
      this.keys.clear();
      this.endDrag();
    });

    viewportEl.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      this.pointerId = e.pointerId;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.dragCurX = e.clientX;
      this.dragCurY = e.clientY;
      viewportEl.setPointerCapture(e.pointerId);
      simStore.getState().setPatch({
        steeringUI: {
          active: true,
          startX: this.dragStartX,
          startY: this.dragStartY,
          curX: this.dragCurX,
          curY: this.dragCurY,
        },
      });
    });

    viewportEl.addEventListener('pointermove', (e) => {
      if (e.pointerId !== this.pointerId) return;
      this.dragCurX = e.clientX;
      this.dragCurY = e.clientY;
      simStore.getState().setPatch({
        steeringUI: {
          active: true,
          startX: this.dragStartX,
          startY: this.dragStartY,
          curX: this.dragCurX,
          curY: this.dragCurY,
        },
      });
    });

    const release = (e: PointerEvent) => {
      if (e.pointerId === this.pointerId) this.endDrag();
    };
    viewportEl.addEventListener('pointerup', release);
    viewportEl.addEventListener('pointercancel', release);

    viewportEl.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        this.zoomDist = Math.max(0.35, Math.min(16.0, this.zoomDist + e.deltaY * 0.0032));
      },
      { passive: false },
    );
  }

  public triggerSpaceAction(): void {
    this.spaceQueued = true;
  }

  public triggerRadarPing(): void {
    this.pingQueued = true;
  }

  private endDrag(): void {
    this.pointerId = null;
    simStore.getState().setPatch({
      steeringUI: { active: false, startX: 0, startY: 0, curX: 0, curY: 0 },
    });
  }

  public sample(): FlightControlSample {
    let pitch = 0;
    let yaw = 0;
    let roll = 0;

    if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) pitch += 1;
    if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) pitch -= 1;
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) yaw += 1;
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) yaw -= 1;
    if (this.keys.has('KeyQ')) roll += 1;
    if (this.keys.has('KeyE')) roll -= 1;

    // 1-finger click/touch-drag steering vector
    if (this.pointerId !== null) {
      const dx = this.dragCurX - this.dragStartX;
      const dy = this.dragCurY - this.dragStartY;
      const maxR = 110;
      if (Math.hypot(dx, dy) > 8) {
        yaw += Math.max(-1, Math.min(1, -dx / maxR));
        pitch += Math.max(-1, Math.min(1, -dy / maxR));
      }
    }

    // Hidden W3C Gamepad polling
    let padBoost = false;
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of pads) {
      if (!gp || !gp.connected) continue;
      if (Math.abs(gp.axes[0]) > 0.14) yaw -= gp.axes[0];
      if (Math.abs(gp.axes[1]) > 0.14) pitch -= gp.axes[1];
      if (gp.buttons[0]?.pressed || gp.buttons[7]?.pressed) {
        padBoost = true;
        if (simStore.getState().flightPhase === 'PAD') this.spaceQueued = true;
      }
      const pingBtn = Boolean(gp.buttons[2]?.pressed || gp.buttons[3]?.pressed);
      if (pingBtn && !this.gamepadPingLatch) this.pingQueued = true;
      this.gamepadPingLatch = pingBtn;
      break;
    }

    const consumeSpaceTrigger = this.spaceQueued;
    const consumeRadarPing = this.pingQueued;
    this.spaceQueued = false;
    this.pingQueued = false;

    return {
      pitch: Math.max(-1, Math.min(1, pitch)),
      yaw: Math.max(-1, Math.min(1, yaw)),
      roll: Math.max(-1, Math.min(1, roll)),
      boost: this.keys.has('Space') || padBoost,
      consumeSpaceTrigger,
      consumeRadarPing,
      zoomDistance: this.zoomDist,
    };
  }
}
