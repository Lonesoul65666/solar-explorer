# Solar Explorer — Project State (`STATE.md`)

> **Dual-Engine Continuity Protocol**: Both **Gemini (Antigravity)** and **Claude** share this file as the single source of truth for repository state. Every agent session **MUST** read `STATE.md` before making changes and update `STATE.md` before concluding work.

**Last Updated**: 2026-10-20  
**Branch**: `main`  
**Working Tree**: Clean  
**Deployment Target**: GitHub Pages (`main` branch, `/ (root)` directory, `.nojekyll` enabled)

---

## 1. Project Overview

**Solar Explorer** (in-app title: *Universe Explorer — Solar System*) is an interactive, museum-grade 3D browser planetarium and educational space-exploration game. It is built for three distinct Explorer Tiers (**Young Explorer 7–10**, **Space Cadet 11–15**, and **Mission Director Adult / Deep Science**) as well as classroom projectors with zero build setup and full offline resilience.

### Core Design Invariants
- **Zero Build Step**: Plain HTML (`index.html`), CSS (`universe.css`), and ES Modules (`universe.js`). Clone and serve over any static HTTP server.
- **Offline-Resilient with Live Telemetry/Archival Upgrades**: Runs 100% offline with local `three.js` (`vendor/three/`), self-hosted `Orbitron` font (`vendor/fonts/`), local 2K NASA surface maps (`textures/`), and 35 procedural SVG schematics (`MISSION_ART_SPECS`). When online, dynamically enriches panels with live NASA Images API galleries (`images-api.nasa.gov`) and real-time ISS orbital telemetry (`api.wheretheiss.at`), falling back instantaneously to offline schematics and procedural orbits if unreachable.
- **Zero Tracking or Accounts**: No analytics, cookies, or telemetry. Only browser `localStorage` (`ue_seen_intro`, `ue_hints_seen`, `ue_explorer_tier`, `ue_voice_name`) is used for local UX preferences.
- **Lush Cinematic Web Audio & Strict English First-Person Speech**: Warm Stellardrone/Interstellar/Mass Effect-style major/minor 7th & 9th ambient pad synthesizer via the **Web Audio API** (withHUD volume slider and automatic 80% voiceover ducking), plus strictly English-filtered **Web Speech API** narration (`window.speechSynthesis`) with HUD voice selector and age-tiered first-person monologues.

---

## 2. Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Markup & UI** | HTML5 (`index.html`) | Single-page application (~605 lines), importmap, Explorer Tier selector, HUD controls, Human Frontier bar, and carousel lightbox |
| **Styling** | CSS3 (`universe.css`) | Custom properties, glassmorphism (`backdrop-filter`), keyframe animations, responsive HUD layout (~1,085 lines) |
| **Application Logic** | Vanilla ES2022 (`universe.js`) | Single-module architecture (~7,947 lines) managing 3D scene, coronal loops, Human Frontier layer, NASA API + SVG fallbacks, ambient synth, and age-tiered first-person speech |
| **3D Engine** | Three.js `r165` (`vendor/three/`) | Vendored `three.module.js` (1.34 MB) + `controls/OrbitControls.js` via native `<script type="importmap">` |
| **Typography** | Orbitron Variable (`vendor/fonts/`) | Self-hosted `orbitron-variable.woff2` (weights 400–900, SIL OFL 1.1) + system fallbacks (`Segoe UI`, `Georgia`) |
| **Surface Maps** | NASA Public-Domain JPEG (`textures/`) | Nine 2K textures (`2k_mercury.jpg`, `2k_venus_atmosphere.jpg`, `2k_earth_daymap.jpg`, `2k_earth_clouds.jpg`, `2k_earth_nightmap.jpg`, `2k_mars.jpg`, `2k_jupiter.jpg`, `2k_saturn.jpg`, `2k_uranus.jpg`, `2k_neptune.jpg`) + procedural canvas textures |
| **Visual Galleries** | Live NASA Images API + Procedural SVG Fallback | Live `images-api.nasa.gov` search carousel (`fetchNasaGallery`, `openLightboxCarousel`) backed by 35 custom-authored SVG schematics (`MISSION_ART_SPECS` / `resolveMissionPhoto`) |
| **Audio & Voice** | Web Audio API + Web Speech API | Warm major/minor 7th & 9th polyphonic pad synth, zero harsh noise, 80% voice ducking, and strict `en-*` voice filtering with HUD selector |

---

## 3. Current Architecture

### Repository Layout
```text
C:\SolarExplorer\
├── .gitignore                          # Ignores .DS_Store, Thumbs.db, node_modules/
├── .nojekyll                           # Disables Jekyll processing on GitHub Pages
├── README.md                           # Quickstart, design constraints, and deployment notes
├── STATE.md                            # Dual-Engine Continuity state tracker (this file)
├── GEMINI.md                           # Architectural context & rules for Gemini / Antigravity
├── CLAUDE.md                           # Architectural context & rules for Claude
├── index.html                          # Entry point, importmap, and all DOM overlays/modals
├── universe.css                        # All styling, themes, animations, and z-index layers
├── universe.js                         # Complete 3D scene, data catalogs, audio, and game systems
├── textures/                           # 9 NASA-derived 2K planet/cloud/nightmap JPEGs (~4.4 MB)
└── vendor/
    ├── fonts/
    │   ├── orbitron.css                # @font-face declaration for Orbitron
    │   └── orbitron-variable.woff2     # Self-hosted variable font
    └── three/
        ├── three.module.js             # Three.js r165 core ES module
        └── controls/
            └── OrbitControls.js        # Three.js r165 OrbitControls
```

### Major Subsystems in `universe.js`
1. **Static Data Catalogs**:
   - `PLANETS`: 10 entries (`sun`, `mercury`, `venus`, `earth`, `mars`, `jupiter`, `saturn`, `uranus`, `neptune`, `pluto`) with orbital/rotational constants, axial tilt, quick stats, surface composition, facts, moons, historical missions, POIs, and atmospheric composition.
   - `MISSIONS`: 8 interactive spacecraft (`iss`, `hubble`, `jwst`, `voyager`, `perseverance`, `juno`, `new_horizons`, `cassini`) rendered in 3D.
   - `HUMAN_FRONTIER`: 5 clickable 3D infrastructure/exploration markers (`frontier_iss`, `frontier_starship`, `frontier_datacenter`, `frontier_jwst`, `frontier_voyager`) with age-tiered descriptions and first-person audio briefings.
2. **Silent 3D Solar Coronal Loops & Prominence Particle System (`createSun`, `updateSolarProminences`)**:
   - Replaces the old full-screen solar flare flash overlay and white-noise gas burst with 8 silent, glowing 3D magnetic coronal loop tubes and a 260-particle solar prominence plasma stream hugging the 3D Sun mesh (`sunObj.group`).
3. **Onboarding Explorer Tier Selector & Real Carl Sagan 3D Fly-In (`EXPLORER_TIERS`, `setExplorerTier`, `runCinematic`)**:
   - **3 Explorer Tiers**: `Young Explorer (Ages 7–10)` (`kids`), `Space Cadet (Ages 11–15)` (`cadet`), and `Mission Director (Adult / Deep Science)` (`director`), selectable on the `#intro` cockpit onboarding screen, `#tier-hud-btn` in the topbar, or `#smenu-tier-row` in the side menu.
   - **Real 3D Solar System Fly-In (`runCinematic`)**: Smoothly flies the live Three.js `PerspectiveCamera` from deep interstellar space (`r = 165`), sweeping past Saturn's rings, Jupiter, and curving in toward the Pale Blue Dot of Earth before settling into solar overview orbit. Syncs line-by-line *Pale Blue Dot* subtitles with real Carl Sagan audio (`./audio/sagan_pale_blue_dot.mp3` or Wikimedia Commons stream, with automatic English Web Speech fallback) and transitions directly into an Explorer-Tiered Ship AI HUD briefing.
4. **Strict English Voice Selector, Auto-Ducking & Age-Tiered First-Person "Hear Me Speak" (`_initVoices`, `PLANET_VOICES`, `speakAsPlanet`)**:
   - Strictly filters `speechSynthesis.getVoices()` for English-only voices (`langNorm.startsWith('en-')`), prioritizing `Microsoft Aria Online (Natural)`, `Microsoft Sonia Online`, `Microsoft Guy Online`, `Google UK English Male`, `Google UK English Female`, `Samantha`, and `Daniel`, and populates `#voice-select` in the HUD.
   - Automatically ducks background music by 80% (`setMusicDuck(true/false)`) during any active speech synthesis.
   - Every planet, the Sun, Pluto, major moons, spacecraft missions, and Human Frontier nodes feature multi-paragraph first-person monologues dynamically tailored to `kids`, `cadet`, and `director` tiers, complete with a `"Tell Me More ↻"` button (`#panel-speak-more`, `#moon-speak-more`) and live transcript box (`#panel-voice-transcript`, `#moon-voice-transcript`).
5. **Lush Stellardrone / Interstellar / Mass Effect Procedural Ambient Synth (`startPlanetariumBGM`, `playPlanetAmbience`, `setMasterVolume`)**:
   - Warm, slow-evolving major/minor 7th and 9th polyphonic pads (`Cmaj9 → Am9 → Fmaj9#11 → G6add9`) using detuned triangle/sine voices, warm 420 Hz low-pass filter sweeps, deep sub-bass, and crystalline harmonic glints—with zero white-noise static and a live HUD Volume Slider (`#audio-vol-slider`).
6. **Live NASA Image Galleries & Interactive Carousel Lightbox (`fetchNasaGallery`, `openLightboxCarousel`)**:
   - Queries `https://images-api.nasa.gov/search?q=...&media_type=image` for every planet, the Sun, moons, spacecraft missions, and Human Frontier nodes, caching results in memory and rendering clickable thumbnail grids that open into a full multi-photo Lightbox Carousel (`#tour-lightbox` with Prev/Next arrows, keyboard navigation, and metadata), with instant offline fallback to procedural SVG schematics (`resolveMissionPhoto`).
7. **The "Human Frontier" Layer (`initHumanFrontier`, `toggleHumanFrontier`, `updateHumanFrontier`, `openFrontierNode`)**:
   - Toggled via `#frontier-hud-btn`, `#frontier-toggle` in the side menu, or hotkey `F`, with a floating quick-jump bar (`#frontier-bar`).
   - Renders 5 clickable 3D orbital markers & trajectories:
     1. **Live ISS (Real-Time Orbit)**: Polls live latitude, longitude, altitude, and velocity from `https://api.wheretheiss.at/v1/satellites/25544` every 10s (with automatic offline orbital math fallback) and positions the 3D ISS marker at its true geocentric coordinates around Earth.
     2. **SpaceX Starship (Mars Transfer)**: Renders a 3D stainless-steel Starship spacecraft flying along a glowing orange 3D Earth-to-Mars Hohmann transfer trajectory curve.
     3. **Orbital AI Data Center (Solar Compute Cluster)**: Renders a 3D radiative-cooled gigawatt orbital compute station in high sun-synchronous Earth orbit.
     4. **James Webb Space Telescope (L2 Halo Orbit)**: Renders JWST's golden honeycomb mirror & sunshield at the Sun-Earth L2 Lagrange point.
     5. **Voyager 1 (Interstellar Frontier)**: Renders humanity's farthest ambassador at the heliopause boundary (`163+ AU`).

---

## 4. Completed Milestones (Git History)

- **`c254665` — Solar Explorer: self-contained solar system explorer**:
  - Standalone extraction, 22 bug fixes, vendored `three.js` r165 and `Orbitron`.
- **`83b34ce` — fix: stop in-app UI chrome bleeding through the intro title screen**
- **`760b833` — feat: restore the warp-tunnel intro and collapse three launch gates into one**
- **`9bc5e0f` — feat: talking planets — each body speaks for itself in its own voice**
- **`729f235` — feat: complete all 5 STATE.md priorities and cohesive UX polish**:
  - Unified `openPlanet('sun')` → `openSun()`, strict `8/8` planet counter, `QUIZ.pluto` + key `'9'`, 35 procedural SVG mission/tour schematics (`MISSION_ART_SPECS`), vertex-colored Spacetime Gravity Well (`G`), and `P`/`H` hotkeys.
- **`9d1a0fa` — Massive 7-Step Visual, Audio, Voice, NASA Gallery & Human Frontier Overhaul**:
  1. **Removed Solar Flare Flash & Static Noise → Added Silent 3D Coronal Loops**: Ripped out `#flare-overlay`, `#flare-warning`, `triggerSolarFlare()`, `playSolarFlareAudio()`, and all white-noise bursts; added 8 dynamic 3D magnetic coronal loop tubes + 260 solar prominence particles on the 3D Sun mesh.
  2. **Cockpit Explorer Tier Selector & Real 3D Carl Sagan Fly-In**: Added 3-tier selector (`Young Explorer 7–10`, `Space Cadet 11–15`, `Mission Director Adult/Deep Science`) on `#intro`, topbar, and side menu; replaced the 2D tunnel canvas with a real 3D Three.js camera fly-in from deep interstellar space past Saturn, Jupiter, and the Pale Blue Dot of Earth synced to Carl Sagan's *Pale Blue Dot* speech and followed by a Ship AI HUD welcome.
  3. **Strict English Voice Selector, 80% Audio Ducking & Age-Tiered First-Person Planets**: Fixed Spanish TTS bug by strictly filtering for `en-*` voices, added `#voice-select` in the HUD, implemented 80% music ducking during speech, and rewrote `PLANET_VOICES` + `speakAsPlanet` with multi-paragraph age-tiered first-person stories, `"Tell Me More ↻"` buttons, and live voice transcripts across all planets, moons, missions, and Frontier nodes.
  4. **Lush Stellardrone / Interstellar / Mass Effect Procedural Ambient Synth**: Replaced harsh vibraphone/noise drones with warm major/minor 7th & 9th polyphonic pads, gentle low-pass filter modulation, and `#audio-vol-slider` in the HUD.
  5. **Live NASA Image Galleries & Lightbox Carousel**: Integrated `images-api.nasa.gov` photo search into every planet, Sun, moon, mission, and Frontier panel with a full prev/next carousel lightbox and instant offline procedural SVG fallback.
  6. **The "Human Frontier" Layer (`F` / HUD / Quick-Jump Bar)**: Added clickable 3D markers, trajectories, live ISS telemetry (`api.wheretheiss.at`), SpaceX Starship Mars Transfer, Orbital AI Data Center, JWST at L2, and Voyager 1.
- **Latest — Stage 1 Outside-In UX Rebuild (`v=8`): Boot Gate, 35s Cold-Open Warp Flyby, Real Audio Pipeline & Video-Game Main Title Screen**:
  1. **The "Initialize Systems" Boot Gate & Real Audio Pipeline**:
     - Redesigned `#intro` into a sleek, dark deep-space Boot Gate featuring `[ INITIALIZE SHIP SYSTEMS ]` (`#start-btn.boot-init-btn`, also triggered via `Enter` / `Space`) with zero launch delay.
     - Authored and ran `scripts/build-intro-audio.mjs` (using Node IPv4 HTTPS synthesis and MPEG-2 Layer III frame-accurate silence pacing) to generate `./audio/intro-narration.mp3` (292.7 KB) for the Carl Sagan *Pale Blue Dot* intro, played via a real `<audio>` element (`_saganAudioEl`) with `speechSynthesis` kept strictly as an emergency fallback if `<audio>` fails.
     - Wired `playCinematicScore()` to check if `./audio/custom-intro.mp3` exists first (crossfading automatically if dropped into `./audio/`), and otherwise play an upgraded 4-act eerie, haunting deep-space Web Audio synthesizer (`Em9 → Cmaj7#11 → Fmaj9#11 → Cmaj9`) with dynamic filter/gain swells and spatial stereo Doppler flyby whooshes (`playFlybyWhoosh()`).
  2. **The 35-Second Cold-Open Warp Flyby (Synced to Audio)**:
     - Clicking `[ INITIALIZE SHIP SYSTEMS ]` immediately starts the deep-space music, plays `audio/intro-narration.mp3`, and launches a 35.0-second 3D camera choreography with dynamic banking roll (`camera.up`):
       - **0s–7s (`PHASE I // INTERSTELLAR WARP ARRIVAL`)**: High-speed warp star-streak tunnel arriving from deep interstellar space.
       - **7s–20s (`PHASE II // OUTER GIANTS BANKING FLYBY`)**: Dynamic banking flybys skimming close past **Neptune** (`7s–11.5s`), sweeping right across **Saturn's illuminated rings** (`11.5s–16.2s`), and banking past **Jupiter** (`16.2s–20s`) with spatial low-end flyby whooshes.
       - **20s–35s (`PHASE III // TERRA — THE PALE BLUE DOT`)**: Smooth deceleration curving past the sunlit crescent of **Earth** (*"That's here. That's home. That's us..."*) before ascending into a high orbital overview of the inner solar system (`(0, 28, 55)`).
     - Synced on-screen cinematic subtitles directly to `_saganAudioEl.currentTime` and placed a `[SPACE / CLICK] SKIP INTRO ⏭` button (`#cine-skip`) in the bottom-right corner that jumps straight to the Main Title Screen at any moment.
  3. **The Video-Game Main Title Screen (`#main-title-screen`) & `solarExplorerSave` Persistence**:
     - When the 35s flyby finishes (or is skipped), `_enterAfterIntro()` fades in the translucent sci-fi **Main Title Screen** (`#main-title-screen`) over the live, slowly orbiting 3D solar system (`_titleScreenOpen` gentle orbital camera drift):
       - `CONTINUE VOYAGE` (`#title-btn-continue`): Enabled whenever `localStorage.getItem('solarExplorerSave')` exists, displaying saved Rank, Track, and `X/8` planets visited (`#title-continue-meta`).
       - `NEW VOYAGE` (`#title-btn-new`): Opens `#title-new-voyage-card` to pick your focus (**Planetary Explorer**, **Rockets & Propulsion**, or **Space Traveler** + Science Depth), initializes `solarExplorerSave` in `localStorage`, and smoothly zooms the camera into the active HUD + first guided objective.
       - `FREE FLIGHT` (`#title-btn-free`): Enters the cockpit HUD immediately in open sandbox mode.
       - `AUDIO & VOICE SETTINGS` (`#title-btn-settings`): Houses the Voice Selector dropdown (`#title-voice-select`, synced with `#voice-select`), Music & Voice Narration volume sliders (`#title-music-vol`, `#title-voice-vol`), Voice Test button, and Replay 35s Cold-Open Flyby button.

---

## 5. Active Work / Known Bugs & Technical Debt

- **None currently open.** Verified with `node --check universe.js` (exit code 0, zero syntax errors) and full offline fallback coverage.

---

## 6. Next Priorities (Future Enhancements)

1. **Interactive Moon Sub-Panels or Close-Up Camera Orbit**:
   - Allow clicking major moons (Europa, Titan, Enceladus, Triton, Charon) directly in the 3D scene to lock the camera onto the moon's orbit in addition to opening the modal card.
2. **Classroom Projector / Teacher Mode**:
   - Optional high-contrast label scaling and auto-cycling planet showcase mode for unattended classroom/museum displays.
3. **Custom Mission Builder / Quiz Challenge Mode**:
   - Allow teachers or kids to run a full-solar-system "Gauntlet Quiz" drawing randomized questions across all 10 bodies (`sun` through `pluto`).
