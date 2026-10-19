# Solar Explorer — Project State (`STATE.md`)

> **Dual-Engine Continuity Protocol**: Both **Gemini (Antigravity)** and **Claude** share this file as the single source of truth for repository state. Every agent session **MUST** read `STATE.md` before making changes and update `STATE.md` before concluding work.

**Last Updated**: 2026-10-19  
**Branch**: `main`  
**Working Tree**: Clean  
**Deployment Target**: GitHub Pages (`main` branch, `/ (root)` directory, `.nojekyll` enabled)

---

## 1. Project Overview

**Solar Explorer** (in-app title: *Universe Explorer — Solar System*) is an interactive, self-contained 3D browser planetarium and educational space-exploration game. It is built for two primary audiences:
1. **Curious kids** exploring the solar system on their own through missions, quizzes, guided tours, rocket flights, and talking planets.
2. **Teachers in classrooms** projecting the solar system with zero setup, zero accounts, and zero dependency on external internet/CDN access.

### Core Design Invariants
- **Zero Build Step**: Plain HTML (`index.html`), CSS (`universe.css`), and ES Modules (`universe.js`). Clone and serve over any static HTTP server.
- **100% Offline / Air-Gapped Runtime**: No CDN scripts, external fonts, or remote API calls. `three.js` (r165) and the `Orbitron` variable font are vendored locally under `vendor/`. All mission and tour schematics are generated procedurally in-memory as SVG data URIs.
- **Zero Tracking or Accounts**: No analytics, cookies, or telemetry. Only browser `localStorage` (`ue_seen_intro`, `ue_hints_seen`) is used for local UX state.
- **100% Procedural Audio & Native Speech**: Ambient planetarium music, 3-act cinematic scores, per-planet soundscapes, and UI SFX are synthesized in real time via the **Web Audio API**. Voice narration and first-person planet monologues use the browser's **Web Speech API** (`window.speechSynthesis`).

---

## 2. Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Markup & UI** | HTML5 (`index.html`) | Single-page application (549 lines), importmap, HUD overlays, modals, and 2D overlay canvases |
| **Styling** | CSS3 (`universe.css`) | Custom properties, glassmorphism (`backdrop-filter`), keyframe animations, responsive HUD layout (797 lines) |
| **Application Logic** | Vanilla ES2022 (`universe.js`) | Single-module architecture (~6,605 lines) managing 3D scene, state, procedural SVG mission art, audio synthesis, speech, and game modes |
| **3D Engine** | Three.js `r165` (`vendor/three/`) | Vendored `three.module.js` (1.34 MB) + `controls/OrbitControls.js` via native `<script type="importmap">` |
| **Typography** | Orbitron Variable (`vendor/fonts/`) | Self-hosted `orbitron-variable.woff2` (weights 400–900, SIL OFL 1.1) + system fallbacks (`Segoe UI`, `Georgia`) |
| **Surface Maps** | NASA Public-Domain JPEG (`textures/`) | Nine 2K textures (`2k_mercury.jpg`, `2k_venus_atmosphere.jpg`, `2k_earth_daymap.jpg`, `2k_earth_clouds.jpg`, `2k_earth_nightmap.jpg`, `2k_mars.jpg`, `2k_jupiter.jpg`, `2k_saturn.jpg`, `2k_uranus.jpg`, `2k_neptune.jpg`) + procedural canvas textures |
| **Mission & Tour Visuals** | Procedural SVG Data URIs (`MISSION_ART_SPECS`) | 35 custom-authored cosmic SVG plates (`resolveMissionPhoto`) for all 8 spacecraft missions and all 10 Guided Tour stops |
| **Audio & Voice** | Web Audio API + Web Speech API | Zero audio files; oscillators, biquad filters, convolver reverbs, noise buffers, and `SpeechSynthesisUtterance` |

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
1. **Static Data Catalogs (lines 4–519)**:
   - `PLANETS`: 10 entries (`sun`, `mercury`, `venus`, `earth`, `mars`, `jupiter`, `saturn`, `uranus`, `neptune`, `pluto`) with orbital/rotational constants, axial tilt, quick stats, surface composition, facts, moons, historical missions, POIs, and atmospheric composition.
   - `MISSIONS`: 8 interactive spacecraft (`iss`, `hubble`, `jwst`, `voyager`, `perseverance`, `juno`, `new_horizons`, `cassini`) rendered in 3D (planet orbiters, surface landers, or deep-space probes).
2. **Procedural & Photo Texture Pipeline (lines 521–874, 1196–1247)**:
   - `makeTexture(id, 1024)` generates immediate procedural textures (fBm noise, craters, gas bands, Great Red Spot, Tombaugh Regio heart) so the scene renders with zero wait.
   - `loadPhotoTextures()` asynchronously loads 2K NASA JPEGs from `textures/`, disposes the temporary procedural `CanvasTexture` instances to free GPU memory, and attaches Earth's cloud layer and night-side city lights emissive map.
   - `updatePanelPreview(id)` & `makeTextureTo2D()` render the 2D `#panel-canvas` preview inside `#info-panel`.
3. **Three.js Scene Graph, Spacetime Gravity Well & Celestial Mechanics (lines 876–1435, 2195–2302)**:
   - `WebGLRenderer` (ACES Filmic tone mapping, exposure `1.6`, shadow maps) + `PerspectiveCamera` + damped `OrbitControls`.
   - `buildNebulaSkybox()`: 2048×1024 procedural galactic/nebula canvas skysphere + 5,000 vertex-colored foreground parallax stars.
   - `createSun()`: Multi-layered glowing Sun mesh at origin (`sunObj`).
   - Planet groups with `ZYX` Euler rotation order for accurate axial tilt spin, atmosphere back-face glow shells, Saturn UV-mapped ring gradient, Uranus vertical ring (`ringsVertical: true`), and procedural moon pivots.
   - `createAsteroidBelt()`: 1,200 instanced dodecahedrons across 3 `InstancedMesh` color groups between Mars and Jupiter (`r = 19.2..22.6`).
   - `APOLLO_SITES`: 10 interactive lat/lon markers on Earth's Moon (Apollo 11–17, Chandrayaan-3, IM-1 Odysseus, Chang'e 6, IM-2 Athena).
   - Kuiper Belt (`4,000` points at `r = 60..82`), vertex-colored deforming Spacetime Gravity Well (`gwMesh`, `updateGravityWell`, `toggleGravityWell`, toggled via `#gravity-hud-btn`, `#gravity-toggle`, or `G`), and 3D hyperbolic Comet flybys (`createComet`/`updateComets`, lines 5592–5684).
4. **Navigation, Unified Sun/Planet Routing & HUD Management (lines 1437–1940, 3882–4508)**:
   - Browser-like history stack (`pushHistory`, `navigateTo`, `#btn-back`/`#btn-fwd`), 3D-projected HTML planet labels (`_updatePlanetLabels`), circular bottom Planet Navigator (`#planet-nav`), Side Menu (`#side-menu`), Planet Comparison Bar (`#comparison-bar`), and True Scale Mode (`setScaleMode`, 1 AU = 6 units).
   - Unified `openPlanet('sun')` → `openSun(addHistory)` routing with solar gold (`--pc: #ffaa22`) theming, `"◆ Take Sun Quiz"` button, and strict 8-planet visited counter (`0/8` to `8/8`, excluding `'sun'`).
   - `MISSION_ART_SPECS` & `resolveMissionPhoto(src, fallbackCaption)` (lines 4150–4424) generate 35 rich SVG schematics (`640×400`) with blueprint telemetry headers and custom vector artwork for every mission card and Guided Tour stop.
5. **Random Events & Gamification (lines 1941–2131, 3416–3880)**:
   - **2D Comet Canvas (`#comet-canvas`)**: Spawns clickable shooting comets every ~5s (+75 XP Comet Bonus). Uses `pointer-events: none` with a `window` click distance test so it never blocks 3D scene raycasting.
   - **Solar Flare System**: Periodic solar storm alert (`triggerSolarFlare`); clicking the Sun during an active flare awards +150 XP (*Solar Storm Rider*).
   - **XP, Ranks & Achievements**: 7 Explorer Ranks (`CADET` → `LEGEND`), 8 Achievements (`ACHIEVEMENTS`) with staggered toast queue (`checkAchievements`), first-visit planet discovery celebration (`triggerDiscovery`), and 15s-per-question timed `QUIZ` (covering all 10 bodies including `sun` and `pluto`) with streak multipliers up to 5×.
6. **Rocket Mode (lines 2515–3017)**:
   - Launch Control (`#rocket-launchpad`), 3-2-1 countdown overlay, quadratic Bezier 3D rocket flight (`rocketMesh` + 80-particle exhaust ring buffer), camera chase, and cycling kid-friendly story cards (`ROCKET_DESTINATIONS` & `MISSION_FACTS`).
7. **Procedural Web Audio Engine (lines 2444–2494, 3019–3414, 4781–4977, 5461–5527, 6109–6169, 6538–6588)**:
   - Generates opening fanfare, "Vast & Wonderful" Planetarium BGM (Cmaj7–Em7–Fmaj7–G6 pads, vibraphone motif, bell glints, airy noise), 62s 3-act E-minor warp score, Guided Tour Cmaj9 pad, per-planet ambient synthesis (`playPlanetAmbience`), Cinematic Premiere 7-phase score, and UI/quiz/mission SFX.
8. **Voice Narration & Talking Planets (lines 5859–6038)**:
   - `speakNarration()` wraps `window.speechSynthesis`.
   - `PLANET_VOICES` & `speakAsPlanet(id)` give all 10 celestial bodies first-person character lines with distinct `rate`/`pitch` pairs, animated equalizer wave on `#panel-speak`, stop-on-reclick/panel-close, and a +25 XP curiosity bonus per body.
9. **Intro, Cinematic Premiere, Guided Tour & Mission Campaign (lines 2311–2442, 4509–5589, 5792–5855, 6040–6604)**:
   - **Launch Flow**: `#intro` title screen → `runCinematic()` (62s warp tunnel on first visit; bypassed via `localStorage.ue_seen_intro` on return visits) → `_enterAfterIntro()` → `showMissionBriefing()` → `window.maybeShowHints()` (4-step first-run tutorial via `localStorage.ue_hints_seen`, toggleable any time with `H`).
   - **Guided Tour (`TOUR_STOPS`)**: 10 stops (Sun → Pluto) with Sagan-style narration, cycling "Wow Facts", 2 procedural SVG schematics per stop, hyperspace warp transition between stops, and locked camera fly-ins.
   - **Cinematic Premiere (`CINEMATIC_BEATS`)**: 12-beat movie-trailer fly-through synchronized with Web Speech narration and phase-based procedural music (replayable from menu).
   - **9-Chapter Mission Campaign (`MISSION_CHAIN`)**: Guided objectives from *Signal Detected (Earth)* to *The Edge of Everything (Pluto)* with a pulsing 3D cyan target ring (`_missionRing`), HUD tracker, Free Explore toggle, and `#resume-campaign-btn` in the side menu.

---

## 4. Completed Milestones (Git History)

- **`c254665` — Solar Explorer: self-contained solar system explorer**:
  - Extracted Solar Explorer into a standalone repository from the multi-project `Dubaiandbackagain` repo.
  - Applied 22 bug fixes, vendored `three.js` r165 (`vendor/three/`) and `Orbitron` (`vendor/fonts/`), removed unused 5.6 MB `music/soundtrack.mp3`, and renamed `universe.html` to `index.html`.
- **`83b34ce` — fix: stop in-app UI chrome bleeding through the intro title screen**:
  - Added CSS general sibling rules (`#intro:not(.hide) ~ ... { visibility: hidden; }`) so HUD chrome stays hidden until `#intro` transitions out.
- **`760b833` — feat: restore the warp-tunnel intro and collapse three launch gates into one**:
  - Restored the 62-second 3-act warp-tunnel intro on first visit (`ue_seen_intro`) and collapsed the 3 redundant launch screens into a single gate that lands directly in the solar system via `_enterAfterIntro()`.
- **`9bc5e0f` — feat: talking planets — each body speaks for itself in its own voice**:
  - Implemented `PLANET_VOICES` and `speakAsPlanet(id)` with 10 distinct `rate`/`pitch` voice characterizations, multi-line cycling monologues, panel-close speech cancellation, and a +25 XP per-body curiosity bonus.
- **Latest — Cohesive Product Polish & All 5 Priority Fixes**:
  - **Unified Sun Routing & Strict `8/8` Planet Counter**: Delegated `openPlanet('sun')` to `openSun(addHistory)`, added solar gold theming (`--pc: #ffaa22`), `"◆ Take Sun Quiz"` button, and `onPlanetVisit('sun')` campaign trigger while excluding `'sun'` from `visitedPlanets` so `#planet-counter-value` starts at `0/8` and never exceeds `8/8`.
  - **Pluto Quiz & `'9'` Shortcut**: Added 4 kid-friendly questions to `QUIZ.pluto`, wired `'9': 'pluto'` in `PLANET_KEYS`, and documented `9` in `#kb-modal`.
  - **Procedural Mission Art & Tour Schematics (`MISSION_ART_SPECS` / `resolveMissionPhoto`)**: Built a self-contained SVG data URI generator with 35 custom vector plates covering all 24 `MISSIONS` photo slots and 20 `TOUR_STOPS` photo slots (2 per stop across all 10 stops), eliminating all broken `<img>` tags and 404 requests offline.
  - **Spacetime Gravity Well (`G` / HUD / Side Menu)**: Upgraded `gwMesh` with vertex-colored gravitational funnels (indigo → cyan → solar gold) and exposed it via `#gravity-hud-btn` in the topbar, `#gravity-toggle` in the side menu, and hotkey `G`.
  - **Keyboard Shortcuts (`P`, `H`, `G`, `9`), Campaign Resume & Dead Code Cleanup**: Wired `P` to pause/resume orbital motion with toast feedback, guarded `H` (tutorial toggle) and `Escape` (dismisses tutorial), made tutorial progress dots clickable, added `#resume-campaign-btn` to `#side-menu`, and removed the dead `#welcome-screen` DOM/CSS/JS and duplicate `makeTextureTo2D` Sun branch.

---

## 5. Active Work / Known Bugs & Technical Debt

- **None currently open.** All 5 priorities from the previous audit have been resolved and verified with zero syntax errors, zero console errors, and zero missing asset requests.

---

## 6. Next Priorities (Future Enhancements)

1. **Interactive Moon Sub-Panels or Close-Up Camera Orbit**:
   - Allow clicking major moons (Europa, Titan, Enceladus, Triton, Charon) directly in the 3D scene to lock the camera onto the moon's orbit in addition to opening the modal card.
2. **Classroom Projector / Teacher Mode**:
   - Optional high-contrast label scaling and auto-cycling planet showcase mode for unattended classroom/museum displays.
3. **Custom Mission Builder / Quiz Challenge Mode**:
   - Allow teachers or kids to run a full-solar-system "Gauntlet Quiz" drawing randomized questions across all 10 bodies (`sun` through `pluto`).
