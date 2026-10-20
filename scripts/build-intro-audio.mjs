/**
 * scripts/build-intro-audio.mjs
 * Generates ./audio/intro-narration.mp3 for the 35-second Cold-Open Warp Flyby
 * ("Pale Blue Dot" by Carl Sagan) with natural cinematic pacing (~34.6s total).
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT_DIR, 'audio');
const OUT_FILE = path.join(AUDIO_DIR, 'intro-narration.mp3');

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Ordered & paced for the 35-second Cold-Open Warp Flyby:
// 0s-7s:   Interstellar warp-speed star-streak tunnel
// 7s-20s:  Banking flybys past Neptune, Saturn's rings & Jupiter
// 20s-35s: Smooth deceleration curving past the sunlit crescent of Earth ("That's here. That's home. That's us...") -> Orbital overview
const SEGMENTS = [
  { pauseBeforeSec: 0.48, text: "From this distant vantage point, the Earth might not seem of any particular interest." },
  { pauseBeforeSec: 1.20, text: "But for us, it's different. Look again at that dot." },
  { pauseBeforeSec: 0.96, text: "On it, everyone you love, everyone you know, every human being who ever was, lived out their lives." },
  { pauseBeforeSec: 0.84, text: "That's here. That's home. That's us." },
  { pauseBeforeSec: 0.60, text: "On a mote of dust, suspended in a sunbeam." },
  { pauseBeforeSec: 0.60, text: "To me, it underscores our responsibility to preserve and cherish the pale blue dot, the only home we have ever known." }
];

function fetchBufferIPv4(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        family: 4,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        },
        timeout: 8000
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchBufferIPv4(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('IPv4 request timeout'));
    });
  });
}

async function main() {
  console.log('[build-intro-audio] Synthesizing Pale Blue Dot narration segments (IPv4)...');
  const rawBuffers = [];
  for (let i = 0; i < SEGMENTS.length; i++) {
    const q = encodeURIComponent(SEGMENTS[i].text);
    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en-GB&q=${q}`;
    const buf = await fetchBufferIPv4(url);
    rawBuffers.push(buf);
  }

  // Each MPEG-2 Layer III 24kHz 64kbps frame is 192 bytes (24ms = 0.024s).
  // The final 192-byte frame of a segment is a valid silent frame.
  const FRAME_BYTES = 192;
  const BYTES_PER_SEC = 8000;
  const silentFrame = rawBuffers[0].subarray(rawBuffers[0].length - FRAME_BYTES);

  const outputChunks = [];
  let cursorBytes = 0;

  for (let i = 0; i < SEGMENTS.length; i++) {
    const pauseFrames = Math.round((SEGMENTS[i].pauseBeforeSec * BYTES_PER_SEC) / FRAME_BYTES);
    for (let f = 0; f < pauseFrames; f++) {
      outputChunks.push(silentFrame);
      cursorBytes += FRAME_BYTES;
    }
    const startSec = cursorBytes / BYTES_PER_SEC;
    outputChunks.push(rawBuffers[i]);
    cursorBytes += rawBuffers[i].length;
    const endSec = cursorBytes / BYTES_PER_SEC;
    console.log(`  ✓ Seg ${i + 1} [${startSec.toFixed(2)}s -> ${endSec.toFixed(2)}s]: "${SEGMENTS[i].text}"`);
  }

  const combined = Buffer.concat(outputChunks);
  fs.writeFileSync(OUT_FILE, combined);
  console.log(`[build-intro-audio] SUCCESS: Wrote ${OUT_FILE} (${(combined.length / 1024).toFixed(1)} KB, ${(cursorBytes / BYTES_PER_SEC).toFixed(2)}s)`);
}

main().catch((err) => {
  console.error('[build-intro-audio] ERROR:', err.message);
  process.exitCode = 1;
});
