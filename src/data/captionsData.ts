export interface SyncedCaptionLine {
  t0: number;
  t1: number;
  text: string;
}

/**
 * Verbatim synced classroom captions for public/audio/ship-welcome.mp3 (13.82s)
 */
export const SHIP_WELCOME_CAPTIONS: SyncedCaptionLine[] = [
  {
    t0: 0.12,
    t1: 5.85,
    text: 'Welcome to Solar Explorer. I hope you have fun traveling the galaxy with us...',
  },
  {
    t0: 6.15,
    t1: 9.0,
    text: 'One last turn...',
  },
  {
    t0: 9.25,
    t1: 13.8,
    text: '...and... here we are. Earth... our home.',
  },
];

/**
 * Verbatim synced classroom captions for public/audio/sagan-real.mp3 (42.00s)
 */
export const SAGAN_REAL_CAPTIONS: SyncedCaptionLine[] = [
  {
    t0: 0.15,
    t1: 5.6,
    text: 'From this distant vantage point, the Earth might not seem of any particular interest.',
  },
  {
    t0: 5.8,
    t1: 10.4,
    text: "But for us, it's different. Consider again that dot.",
  },
  {
    t0: 11.05,
    t1: 15.1,
    text: "That's here. That's home. That's us.",
  },
  {
    t0: 15.35,
    t1: 25.7,
    text: 'On it, everyone you love, everyone you know, everyone you ever heard of, every human being who ever was, lived out their lives.',
  },
  {
    t0: 26.0,
    t1: 37.8,
    text: "To me, it underscores our responsibility to deal more kindly with one another, and to preserve and cherish the pale blue dot, the only home we've ever known.",
  },
  {
    t0: 38.05,
    t1: 41.95,
    text: '...on a mote of dust, suspended in a sunbeam.',
  },
];
