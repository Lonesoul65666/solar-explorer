/**
 * scripts/build-intro-audio.mjs
 * Builds the locked master audio & video assets for the Video-Game Cutscene -> 3D Engine Handoff:
 *   1. audio/sagan-real.ogg & audio/sagan-real.mp3 (42.00s real Carl Sagan "Pale Blue Dot" + dark deep-space ambient drone)
 *   2. audio/welcome-handoff.mp3 (13.82s pre-generated local Ship Narrator handoff track — ZERO live browser TTS)
 *   3. video/intro-cutscene.mp4 (42.00s 1280x720@30fps H.264 + AAC cutscene ending on a golden solar flare)
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT_DIR, 'audio');
const VIDEO_DIR = path.join(ROOT_DIR, 'video');

for (const dir of [AUDIO_DIR, VIDEO_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function verifyOrBuildAssets() {
  const required = [
    path.join(AUDIO_DIR, 'sagan-real.ogg'),
    path.join(AUDIO_DIR, 'sagan-real.mp3'),
    path.join(AUDIO_DIR, 'welcome-handoff.mp3'),
    path.join(VIDEO_DIR, 'intro-cutscene.mp4'),
  ];

  const allPresent = required.every(f => fs.existsSync(f) && fs.statSync(f).size > 100000);
  if (allPresent) {
    for (const f of required) {
      const kb = (fs.statSync(f).size / 1024).toFixed(1);
      console.log(`[build-intro-audio] Verified ${path.relative(ROOT_DIR, f)} (${kb} KB)`);
    }
    return;
  }

  const cscPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';
  const csFile = path.join(__dirname, 'BuildIntroCutscene.cs');
  const exeFile = path.join(__dirname, 'BuildIntroCutscene.exe');
  const ffmpegOut = execFileSync('python', ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], { encoding: 'utf8' }).trim();

  if (fs.existsSync(cscPath) && fs.existsSync(csFile) && fs.existsSync(ffmpegOut)) {
    execFileSync(cscPath, ['/nologo', '/optimize+', '/r:System.Drawing.dll', `/out:${exeFile}`, csFile], { stdio: 'inherit' });
    execFileSync(exeFile, [ffmpegOut, path.join(AUDIO_DIR, 'sagan-real.ogg'), path.join(VIDEO_DIR, 'intro-cutscene.mp4')], { stdio: 'inherit' });
    try { fs.unlinkSync(exeFile); } catch (e) {}
  }
}

verifyOrBuildAssets();
