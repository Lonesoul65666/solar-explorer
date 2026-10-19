# CLAUDE.md — Solar Explorer Architectural Context & Workspace Rules

> **TOP RULE — DUAL-ENGINE CONTINUITY PROTOCOL (MANDATORY)**
> 1. **Read First**: At the start of **every** session or task, you **MUST** read `STATE.md` to load the current project state, active work, known bugs, and next priorities.
> 2. **Update Last**: Before finishing **any** task that modifies code, fixes a bug, alters architecture, or shifts priorities, you **MUST** update `STATE.md` (and keep `CLAUDE.md` and `GEMINI.md` synchronized if architectural facts change).

---

## 1. Project Identity & Core Design Constraints

**Solar Explorer** (UI title: *Universe Explorer — Solar System*) is an interactive, browser-based 3D solar system planetarium and educational game designed for kids and classroom projectors.

Every change to this repository **MUST** preserve these four non-negotiable constraints:
1. **No Build Step**: Plain HTML5 (`index.html`), CSS3 (`universe.css`), and native ES Modules (`universe.js`). Do **not** introduce bundlers (Vite, Webpack, Rollup), transpilers (TypeScript, Babel), or runtime npm dependencies.
2. **100% Offline / Zero External Network Requests**: The app must run with all external network access blocked (school firewalls, offline laptops, USB sticks). `three.js` r165 (`vendor/three/`) and the `Orbitron` font (`vendor/fonts/`) are vendored locally. Never add `<script>`, `<link>`, `<img src>`, or `fetch()` calls pointing to external CDNs or Google Fonts.
3. **No Tracking, Accounts, or Analytics**: Zero telemetry or third-party scripts. Local state is restricted to `localStorage` (`ue_seen_intro`, `ue_hints_seen`).
4. **100% Procedural Audio & Native Web Speech**: All music, ambiences, and sound effects are synthesized via the **Web Audio API**; all voice narration and "Talking Planets" monologues use the browser's **Web Speech API** (`window.speechSynthesis`). Do not add `.mp3`/`.wav`/`.ogg` audio files.

---

## 2. Build, Run & Verification Commands

There is no build step or package manager required to run the app. Because `index.html` uses `<script type="importmap">` and `<script type="module">`, it **must** be served over HTTP (`file://` is blocked by browser CORS policies for ES modules).

### Local Development Server
```powershell
# Option 1: Python 3 (built-in HTTP server)
python -m http.server 8000
# Or on macOS/Linux:
python3 -m http.server 8000

# Option 2: Node.js (if npx is available)
npx --yes serve -l 8000 .
```
Then open **`http://localhost:8000`** in any modern browser.

### Verification Checklist
When verifying changes in a browser or headless Chromium:
- Confirm **zero console errors** and **zero unhandled promise rejections** (note: `index.html` installs a global `window.onerror` / `unhandledrejection` banner `#_err` at the bottom of the viewport — it must never appear).
- Confirm **zero external network requests** (all requests must resolve to `localhost` / the origin host).
- If modifying `universe.css` or `universe.js`, note the cache-busting query string in `index.html` (`universe.css?v=5`, `universe.js?v=5`) if testing against cached environments.

### Deployment (GitHub Pages)
- Deployed directly from branch `main`, folder `/ (root)`, with `.nojekyll` present at the repository root so `index.html` serves at the bare root URL.

---

## 3. Repository Structure & File Responsibilities

| Path | Size / Lines | Responsibility |
| :--- | :--- | :--- |
| `STATE.md` | Continuity State | Single source of truth for completed milestones, active bugs, and next priorities. |
| `CLAUDE.md` / `GEMINI.md` | Agent Context | Matching architectural rules and instructions for Claude and Gemini engines. |
| `index.html` | ~549 lines | Single-page shell, global `#_err` error overlay, `<script type="importmap">`, and all UI DOM overlays/modals. |
| `universe.css` | ~797 lines | All styling, CSS variables (`--cyan`, `--orange`, `--pc`), HUD layout, animations, and intro chrome suppression rules. |
| `universe.js` | ~6,605 lines | Complete application logic: 3D scene, data catalogs, procedural textures & SVG mission schematics, Web Audio synth, Web Speech narration, and game modes. |
| `textures/` | 9 JPEGs (~4.4 MB) | Public-domain 2K NASA surface maps (`mercury`, `venus_atmosphere`, `earth_daymap`, `earth_clouds`, `earth_nightmap`, `mars`, `jupiter`, `saturn`, `uranus`, `neptune`). |
| `vendor/three/` | Three.js r165 | Local ES module `three.module.js` and `controls/OrbitControls.js`. |
| `vendor/fonts/` | Orbitron OFL | `orbitron.css` and `orbitron-variable.woff2` (weights 400–900). |

---

## 4. Architectural Map of `universe.js`

Because all JavaScript lives in a single ES module (`universe.js`), keep these structural boundaries and conventions in mind when editing:

### Data Catalogs & Constants
- **`PLANETS` (`lines 5–396`)**: Array of 10 objects (`sun`, `mercury`, `venus`, `earth`, `mars`, `jupiter`, `saturn`, `uranus`, `neptune`, `pluto`). Note that `sun` is at index `0` for data/UI lookup, but its 3D mesh is built separately by `createSun()`, **not** in the `PLANETS.forEach` mesh builder (`if(pdata.id === 'sun') return;`). Always filter out `sun` when iterating over orbital planets (e.g. `PLANETS.filter(p => p.id !== 'sun')`).
- **`MISSIONS` (`lines 398–519`)**: 8 spacecraft (`iss`, `hubble`, `jwst`, `voyager`, `perseverance`, `juno`, `new_horizons`, `cassini`). Each is either a planet orbiter (`hostPlanet` + `orbitHeight`), a surface mission (`hostPlanet` + `surfaceMission: true`), or a deep-space probe (`deepSpacePos: {x,y,z}`).
- **`APOLLO_SITES` (`lines 1301–1312`)**: 10 lunar landing site markers attached to Earth's Moon mesh.
- **`SUN_DATA` (`lines 1587–1596`)**: Extended stats, facts, probes, and internal layers for `openSun()` (note: `openPlanet('sun')` delegates to `openSun()`).
- **`ROCKET_DESTINATIONS` (`lines 2522–2643`) & `MISSION_FACTS` (`lines 2646–2657`)**: Story cards and arrival banners for Rocket Mode.
- **`ACHIEVEMENTS` (`lines 3424–3436`) & `EXPLORER_LEVELS` (`lines 3467–3475`)**: 8 achievements and 7 XP rank thresholds (`CADET` at 0 XP up to `LEGEND` at 15,000 XP).
- **`QUIZ` (`lines 3645–3698`)**: Per-body multiple-choice quiz pools (`sun` through `pluto`) used by `window.launchQuiz(planetId)`.
- **`MISSION_ART_SPECS` & `resolveMissionPhoto(src, fallbackCaption)` (`lines 4150–4424`)**: Procedural SVG schematic generator producing crisp offline `data:image/svg+xml;utf8,...` visuals for all 24 `MISSIONS` photos and all 20 `TOUR_STOPS` photos.
- **`TOUR_STOPS` (`lines 4980–5087`)**: 10 Sagan-style Guided Tour stops (`planetId: null` for the Sun, followed by `mercury` through `pluto`).
- **`PLANET_VOICES` (`lines 5907–5961`)**: First-person voice lines and `{rate, pitch}` profiles for all 10 bodies (`speakAsPlanet(id)`).
- **`CINEMATIC_BEATS` (`lines 6038–6098`)**: 12-beat movie-trailer sequence for `startCinematicPremiere()`.
- **`MISSION_CHAIN` (`lines 6309–6363`)**: 9 sequential campaign missions (`earth_base` → `final_frontier`).

### 3D Scene & Rendering Conventions
- **Axial Tilt**: Planet meshes use `mesh.rotation.order = 'ZYX'` (`line 1068`) so axial tilt (`rotation.z`) stays fixed in world space while daily spin (`rotation.y`) rotates around the tilted axis. Do not revert to `'XYZ'`.
- **Texture Memory Management**: Planets initialize with procedural 1024×1024 `CanvasTexture`s (`makeTexture`) and upgrade asynchronously in `loadPhotoTextures()`. Always call `.dispose()` on the replaced procedural texture (`line 1219`) to avoid leaking ~36 MB of GPU memory.
- **Spacetime Gravity Well (`gwMesh` / `updateGravityWell` / `toggleGravityWell`, `lines 1367–1435`)**: Vertex-colored wireframe grid deformed by the gravitational wells of the Sun and planets; toggled via `#gravity-hud-btn`, `#gravity-toggle`, or hotkey `G`.
- **Render Loop (`animate()`, `lines 2205–2302`)**: Runs at 60 fps. Avoid per-frame heap allocations (`new THREE.Vector3()`, DOM queries, or scene-graph `.filter()` walks) inside `animate()` and `_updatePlanetLabels()`. Use hoisted scratch vectors (`_wposTmp`, `_labelTmpV`, `_lblWpos`, `_lblProj`) and cached references (`_beltRefs`, `getPickList()`).
- **Raycasting & Overlays**: Any full-screen decorative `<canvas>` or `<div>` above `#canvas-container` (such as `#comet-canvas` at `z-index: 80`) **must** keep `pointer-events: none` so it does not shield the 3D scene from mouse hover/click raycasts.

### Launch Sequence & State Guards
1. **Intro Screen (`#intro`)**: Displays over the live 3D scene while `#intro:not(.hide) ~ ... { visibility: hidden; }` hides in-app HUD chrome.
2. **Warp-Tunnel Intro (`runCinematic()`)**: Triggered by clicking `#start-btn`. On first visit (`localStorage.getItem('ue_seen_intro') !== '1'`), plays the 62s perspective star-tunnel monologue and 3-act E-minor score (`_introActive = true`, blocking global hotkeys except `Escape`/`Space`/`Enter` to skip). On return visits, skips straight to `_enterAfterIntro()`.
3. **Post-Intro Handoff (`_enterAfterIntro()`)**: Resets camera to overview `(0, 28, 55)`, starts `startPlanetariumBGM()`, and opens the current campaign mission via `showMissionBriefing(_completedMissions.size)`.
4. **First-Run Tutorial (`window.maybeShowHints()`)**: Called 900ms after `#mbrief-start` is clicked on first visit (`localStorage.getItem('ue_hints_seen') !== '1'`).
5. **Module Scope vs. Global `window` Handlers**: Because `universe.js` is an ES module, top-level functions are **not** on `window` unless explicitly assigned (`window.showMoon`, `window.zoomCloser`, `window.launchQuiz`, `window.openTourLightbox`, `window.maybeShowHints`, `window.resumeMissionCampaign`). Prefer `addEventListener` in `universe.js` over inline `onclick=` attributes in `index.html`.
