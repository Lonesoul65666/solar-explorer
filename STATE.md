# Solar Explorer — Project State (`STATE.md`)

> **Dual-Engine Continuity Protocol**: Both **Gemini (Antigravity)** and **Claude** share this file as the single source of truth for repository state. Every agent session **MUST** read `STATE.md` before making changes and update `STATE.md` before concluding work.

**Last Updated**: 2026-10-23  
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
| **Surface Maps** | NASA Public-Domain JPEG/PNG (`textures/`) | High-res multi-layer Earth textures (`earth_day.jpg`, `earth_normal.jpg`, `earth_spec.jpg`, `earth_night.png`, `earth_clouds.png`), bump/normal-mapped Moon (`moon.jpg`), plus nine 2K planet maps (`2k_*.jpg`) |
| **Visual Galleries** | Live NASA Images API + Procedural SVG Fallback | Live `images-api.nasa.gov` search carousel (`fetchNasaGallery`, `openLightboxCarousel`) backed by 35 custom-authored SVG schematics (`MISSION_ART_SPECS` / `resolveMissionPhoto`) |
| **Audio & Voice** | Pre-Rendered Cutscene (`video/intro-cutscene.mp4`) + Mastered Audio + Web Audio/Speech API | 42.0s H.264/AAC pre-rendered cutscene (`video/intro-cutscene.mp4`), 42.0s mastered Carl Sagan *Pale Blue Dot* + dark ambient drone (`audio/sagan-real.ogg` / `audio/sagan-real.mp3`), pre-generated 13.82s handoff track (`audio/welcome-handoff.mp3` — zero live TTS in intro), 5-act deep-space pad synth, 80% voice ducking, and strict `en-*` voice filtering |

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
- **Stage 1 Outside-In UX Rebuild (`v=8`): Boot Gate, Cold-Open Warp Flyby, Real Audio Pipeline & Video-Game Main Title Screen**:
  - Redesigned `#intro` into `[ INITIALIZE SHIP SYSTEMS ]` Boot Gate (`#start-btn.boot-init-btn`), added `#main-title-screen` with `solarExplorerSave` persistence (`CONTINUE VOYAGE`, `NEW VOYAGE`, `FREE FLIGHT`, `AUDIO & VOICE SETTINGS`), and added `scripts/build-intro-audio.mjs`.
- **Super High-Res Multi-Layer Earth, GLSL Fresnel Atmospheric Shader & Two-Part Cutscene (`v=9`)**:
  - Replaced procedural canvas Earth with a multi-layered photorealistic 3D Earth (`earth_day.jpg`, `earth_normal.jpg`, `earth_spec.jpg`, `earth_night.png`, independent `earth_clouds.png` sphere, dual-shell Fresnel atmospheric scattering shaders) and bump/normal-mapped Moon (`moon.jpg`).
- **Latest — True Video-Game Cutscene Architecture (`video/intro-cutscene.mp4`) -> Solar Flare Crossfade -> Live 3D Engine Handoff (`v=10`)**:
  1. **Mastered Intro Audio Assets (Zero Live Browser TTS in Intro)**:
     - **`audio/sagan-real.ogg` & `audio/sagan-real.mp3` (`42.00s`)**: Extracted and crossfaded all 6 archival Carl Sagan *Pale Blue Dot* segments (*"We succeeded in taking that picture... Look again at that dot. That's here. That's home. That's us... The Earth is a very small stage in a vast cosmic arena... To me, it underscores our responsibility... on a mote of dust, suspended in a sunbeam"*) and mixed them with a dark, mysterious stereo deep-space ambient drone + golden solar flare climax swell into one locked master track.
     - **`audio/welcome-handoff.mp3` (`13.82s`)**: Pre-generated and mastered local Ship Narrator audio file speaking *"Welcome to Solar Explorer. I hope you have fun traveling the galaxy with us... One last turn... and... here we are. Earth... our home."* (pre-fetched and pre-decoded into an `AudioBuffer` during the video cutscene so the 3D handoff runs with zero latency and zero live `window.speechSynthesis`).
  2. **Pre-Rendered 42-Second Video Cutscene (`video/intro-cutscene.mp4` + `scripts/BuildIntroCutscene.cs`)**:
     - Generated `video/intro-cutscene.mp4` (`1280×720 @ 30fps`, H.264 + AAC 199kbps, `+faststart`, 42.00s) rendering the three-act visual journey locked to the Carl Sagan master audio:
       - `0s – 15s`: Thousands of light-years away in dark, mysterious deep space with warp-speed star streaks, rotating spiral galaxies, and volumetric dark/cyan/violet nebulae rushing past the camera.
       - `15s – 30s`: Gradual warp tunnel deceleration as Sagan reflects on how small our world is in the cosmic dark while our Sun ignites in the center distance and grows into a blazing golden sphere.
       - `30s – 42s`: Gliding past the outer edge of the solar system (ringed Saturn silhouette + Pale Blue Dot glinting inside a diagonal sunbeam) as the blazing Sun fills the screen with warm golden glare on *"...on a mote of dust, suspended in a sunbeam"*.
  3. **Background 3D Warmup & Seamless Golden Solar Flare Crossfade -> Stop at Earth (`runCinematic`, `warmUp3DEngineForHandoff`, `#cine-solar-flare`)**:
     - While `video/intro-cutscene.mp4` plays in full-screen cinema mode (with `[SPACE / CLICK] SKIP INTRO ⏭`), `_gpuInitTexture` and `warmUp3DEngineForHandoff()` silently upload all 2K planet textures to the GPU and compile all Three.js GLSL shaders (`renderer.compile(scene, camera)`).
     - At `~42s`, `#cine-solar-flare` swells on the golden Sun glare to crossfade seamlessly out of the video into the live 3D solar system while `audio/welcome-handoff.mp3` plays, sweeping the live camera inward past the outer planets, banking around the Moon's horizon on *"One last turn..."* (`7.09s`), stopping in high orbit facing our high-res multi-layer Earth (`_getEarthHeroFraming(0)`), and fading in the Main Game Title Menu (`#main-title-screen`) on the left side of the screen.

---

## 5. Active Work / Known Bugs & Technical Debt

- **None currently open.** Verified with `node --check universe.js` (exit code 0, zero syntax errors) and full offline fallback coverage.
- **Latest — Carl Sagan Verbatim Audio/Subtitle Sync + Arcade Visor HUD & 3D Surface Anomaly Scanner Overhaul (`v=11` — 2026-10-23):**
  1. **Carl Sagan Audio & Cutscene Re-Master (`audio/sagan-real.ogg`, `audio/sagan-real.mp3`, `video/intro-cutscene.mp4`, `SAGAN_SCRIPT`, `SHIP_SCRIPT`):**
     - **Root Cause Fixed**: Audited `audio/sagan-real.ogg` and found that the first 20.05s slice of the Archive.org *Pale Blue Dot* recording actually spoke *"From this distant vantage point, the Earth might not seem of any particular interest... Consider again that dot. That's here. That's home. That's us. On it, everyone you love..."* (cutting off mid-sentence at 20.05s), whereas `SAGAN_SCRIPT` previously displayed *"Look again at that dot..."* at `0.15s`.
     - **Verbatim Complete-Sentence Master (`42.00s`)**: Re-sliced `[(0.00, 5.70), (7.30, 9.50), (17.55, 10.65), (191.05, 12.05), (67.90, 4.10)]` from the original Carl Sagan recording so every sentence finishes naturally (*"...every human being who ever was, lived out their lives"* and *"...to preserve and cherish the pale blue dot, the only home we've ever known"*), mixed with the dark deep-space ambient drone (`audio/sagan-real.ogg`, `audio/sagan-real.mp3`, `audio/intro-narration.mp3`) and re-baked `video/intro-cutscene.mp4` (`42.00s`, 1280×720 @ 30fps).
     - **100% Verbatim Subtitle Synchronization**: Updated `SAGAN_SCRIPT` and `SHIP_SCRIPT` in `universe.js` so every subtitle card matches Carl Sagan's and the Ship Narrator's exact spoken words and timestamps to the tenth of a second (`?v=7` cache-busting).
  2. **Sleek Cockpit Visor HUD Overhaul (`index.html`, `universe.css`, `universe.js`):**
     - Replaced the intrusive 490px webpage-style planet modal (`#info-panel`), full-screen blocking moon modal (`#moon-detail`), 500px mission modal (`#mission-panel`), and blocking `#mission-briefing` wall with a sleek, translucent **Cockpit Visor HUD** (`width: clamp(285px, 21.5vw, 344px)`) docked to the right edge (`top: 56px; bottom: 58px`) that leaves **78%+ of the 3D viewport completely unobstructed** and hides the redundant 2D `#panel-canvas`.
     - Converted `#discovery-overlay` and `#tour-title-card` into compact top-center visor HUD banners so planet arrivals never obscure the 3D sphere.
  3. **Interactive 3D Surface Anomaly / Hotspot Scanner (`SURFACE_HOTSPOTS`, `spawnSurfaceHotspotsForBody`, `triggerHotspotScan`, `_updateSurfaceHotspots`):**
     - When orbiting any planet, the Sun, or a moon, renders **3 to 4 glowing, pulsing 3D target markers** (`Sprite` beacon + pulsing surface `RingGeometry` + projected 2D `.hotspot-reticle` HUD brackets) locked to real `(lat, lon)` surface coordinates on the rotating 3D sphere (e.g., *Olympus Mons*, *Valles Marineris*, *Jezero Crater* & *North Polar Ice Cap* on Mars; *Great Red Spot*, *Jovian Polar Auroras* & *Metallic Hydrogen Core* on Jupiter; *Mariana Trench*, *Amazon Basin*, *Sahara Dust Plume* & *Aurora Oval* on Earth; *Loki Patera* & *Pele Plume* on Io).
     - Players rotate the 3D globe to bring hidden farside markers into view, click either the 3D surface marker, floating HUD reticle, or Visor button to trigger an arcade scan sound (`playArcadeScannerSFX`), camera focus, first-person voiceover briefing, and NASA photo card, earning **+75 Flight License XP** per scan (`+150 XP` bonus when all anomalies on a world are scanned).
  4. **Persistent Top-Left Active Mission & Flight License Tracker (`#mission-hud.visor-objective-tracker`, `_refreshMissionTrackerHUD`):**
     - Upgraded `#mission-hud` into a persistent top-left Cockpit Objective Tracker displaying the player's **Flight License Rank** (`CADET` → `LEGEND`), live **XP counter**, current **Mission Objective**, **3D Surface Scan progress** (`X/Y Scanned`), and a 1-click **`🎯 Lock Target`** warp button (`#mhud-warp-btn`).
  1. **Jupiter's 4 Galilean Moons (`makeMoonTexture`, `planetMeshes`, `getPickList`, `window.showMoon`):**
     - Rendered all 4 Galilean moons (`Io`, `Europa`, `Ganymede`, `Callisto`) around Jupiter with tight orbital radii (`3.16` to `4.00` units from Jupiter's center—well inside 35% of the Jupiter–Saturn gap so they never touch Saturn's rings).
     - Built distinct 256×128 procedural canvas textures and PBR materials for **Io** (sulfur yellow/orange + mottled black lava calderas with molten rims), **Europa** (brilliant icy white/pale-blue shell crisscrossed with dark reddish-brown `lineae` fractures), **Ganymede** (two-tone dark cratered rock and lighter grooved tectonic ice plains), and **Callisto** (dark charcoal-brown cratered ice/rock with bright white impact rays and Valhalla multi-ring basin).
     - Added all rendered moon meshes (`userData.moonKey`) into `getPickList()` and updated `window.showMoon(planetId, moonName)` to fly the 3D camera directly to the clicked moon and open `#moon-detail`.
  2. **Satellite / Probe Scale, Metallic PBR Shading & Distance LOD (`createMissionMeshGroup`, `_buildFrontierMesh`, `updateHumanFrontier`, `animate`):**
     - Scaled all `MISSIONS` and `HUMAN_FRONTIER` 3D spacecraft models down by 75% (`0.25x`), replaced flat `MeshBasicMaterial` with metallic gold Kapton foil, brushed silver/titanium, and deep-blue photovoltaic solar panel PBR `MeshStandardMaterial`, and implemented distance-based LOD visibility so probes hide/fade when zoomed far out unless their host planet or Mission/Frontier panel is focused.
  3. **Uninterrupted Carl Sagan Audio Stream + 3.5s Cosmic Silence Pause + Full System Perimeter Orbit (`runCinematic`):**
     - Pre-warmed 3D shaders once before playback (`warmUp3DEngineForHandoff`), muted `videoEl` so it never fights audio, and played `audio/sagan-real.ogg` in a single continuous, uninterrupted stream from `0.0s` driving `SAGAN_SCRIPT` subtitles passively.
     - Added a 3.5-second pause (`PAUSE_DUR = 3.50`) of eerie cosmic silence after Sagan's speech completes, followed by a wide, graceful 3D camera sweep around the outer perimeter of the solar system (*"The universe, while a tiny dot, is a vast space..."*) banking inward across the ecliptic past the Moon to rest at Earth (*"...and here we are, right at home"*).
  4. **Earth & Planet Photo Gallery Filtering (`PLANET_GALLERY_CONFIG`, `fetchNasaGallery`, `MISSION_ART_SPECS`):**
     - Updated Earth's gallery query and curated schematics to showcase living oceans, coral reefs, Amazon rainforest biodiversity, polar auroras, and orbital lightning storms, while filtering out people/meetings/ceremonies/podiums/portraits from NASA Image API results.
  5. **Scannable Visual Cards & 3 Quick-Glance Stat Gauges (`openPlanet`, `openSun`, `universe.css`):**
     - Replaced dense text walls in planet and Sun panels with 3 circular SVG Quick-Glance Stat Gauges (`Diameter`, `Temperature`, `Orbit & Day`), scannable visual discovery cards (`.visual-fact-card`), clean tabs (`Overview`, `Surface & Sky`, `Missions`, `Moons`), and larger readable typography (`14.5px–15.5px` body/card values).

---

## 6. Next Priorities (Future Enhancements)

1. **Interactive Moon Sub-Panels or Close-Up Camera Orbit**:
   - Allow clicking major moons (Europa, Titan, Enceladus, Triton, Charon) directly in the 3D scene to lock the camera onto the moon's orbit in addition to opening the modal card.
2. **Classroom Projector / Teacher Mode**:
   - Optional high-contrast label scaling and auto-cycling planet showcase mode for unattended classroom/museum displays.
3. **Custom Mission Builder / Quiz Challenge Mode**:
   - Allow teachers or kids to run a full-solar-system "Gauntlet Quiz" drawing randomized questions across all 10 bodies (`sun` through `pluto`).
