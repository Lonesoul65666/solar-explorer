# Solar Explorer V2 — Project State (`STATE.md`)

> **Dual-Engine Continuity Protocol**: Both **Gemini (Antigravity)** and **Claude** share this file as the single source of truth for repository state. Every agent session **MUST** read `STATE.md` before making changes and update `STATE.md` before concluding work.

**Last Updated**: 2026-11-11  
**Active Branch**: `v2-rebuild` (archived V1 on `v1-legacy` @ `719e0c5`; live production `main` untouched)  
**Build Stack**: TypeScript (strict ES2022) + Vite (`base: './'`) + Three.js + Zustand  
**Hard Line Limit**: Verified — all 25 files in `src/` strictly `< 200` lines (max: `193` lines)

---

## 1. V2 Creative & Engineering Contract

- **Fictional Ship, Factual Universe**: Players pilot a multi-part industrial sci-fi Corvette across a scientifically grounded Solar System. **Zero trivia modals**, **zero blocking popups**, and **zero browser Web Speech TTS**.
- **Aesthetic Triad**:
  - **Homeworld Tactical Sensors Manager**: Diegetic bottom Sensor Bar, subtle `#38bdf8` cyan tour ribbon, proximity holographic probe brackets, and Explorer/Pro tabular telemetry.
  - **The Expanse Mechanical Realism**: 4-second star-streak Pulse Jump followed by a 180-degree flip-and-burn deceleration burn on approach, directional crisp RCS thruster puffs, and hull-conducted thruster rumble.
  - **Firefly Frontier Grit**: Warm tungsten-amber (`#f59e0b`) and slate-cyan (`#38bdf8`) accents over deep void (`#05080f`), matte gunmetal plating, exposed radiator vanes, and self-hosted `Orbitron` font.
- **Strict Dependency & File-Size Discipline**:
  - `package.json` contains **ONLY** `three`, `@types/three`, `zustand`, `typescript`, and `vite`.
  - Every file under `src/` stays strictly under **200 lines**.

---

## 2. Completed Milestones

1. **Phase 1 — Safe V1 Archive (`v1-legacy`)**:
   - Audited all `textures/`, `audio/`, and `video/` sizes, updated `.gitignore` (`node_modules/`, `dist/`), archived and pushed the complete Oct 23 V1 build + audio/texture assets to `origin/v1-legacy` (`719e0c5`), moved `video/` backup outside V2 workspace (`../SolarExplorer_V1_Video_Backup`), and branched `v2-rebuild` while leaving `main` intact.
2. **Phase 2 — Asset Migration & Monolith Purge**:
   - Migrated `public/textures/`, `public/audio/`, `public/fonts/` (`Orbitron`), `.nojekyll`, and `favicon.*` into `public/`; retained `scripts/` at root; deleted V1 monolith (`universe.js`, `universe.css`, V1 `index.html`, `vendor/`).
3. **Phase 3 — V2 Stack & Guardrails**:
   - Initialized `package.json`, strict ES2022 `tsconfig.json`, and `vite.config.ts` (`base: './'`). Synchronized `STATE.md`, `GEMINI.md`, and `CLAUDE.md`.
4. **Phase 4 — Playable Vertical Slice 1 (Flight Core & Stops 1–4)**:
   - **Core (`src/core/`)**: Double-precision `FloatingOrigin` (`81L`) re-centering around the active celestial stop to eliminate WebGL float32 jitter, `ScaleManager` (`98L`) Dual-Scale log interpolation (`Tour Scale` ↔ `True Astronomical Scale`), and vanilla `zustand` simulation store (`86L`).
   - **Flight (`src/flight/`)**: `.glb`-ready industrial `CorvetteMesh` (`180L` — matte gunmetal hull, copper/amber radiator vanes, recessed cyan/amber vents, reactive twin ion plumes, 8-nozzle directional RCS puffs, swiveling radar dish), Chromebook-proof `InputRouter` (`173L` — Arrows + auto-leveling horizon, Spacebar ignition/boost, Enter radar ping, 1-finger click-drag steering vector, hidden WASD/Gamepad, scroll zoom-through), `ChaseCamera` (`64L`), `FlightPhysics` (`102L`), and `Autopilot` (`193L` — Earth dusk pad cold open → cloud-deck ascent → 4s star-streak Pulse Jump → 180° Expanse flip-and-burn braking).
   - **World & Data (`src/world/`, `src/data/`)**:
     - **Stop 1 — The Sun**: Animated procedural GLSL photosphere granulation + Fresnel corona shader (`SunShader.ts`, `126L`) & orbiting **Parker Solar Probe**.
     - **Stop 2 — Mercury**: `2k_mercury.jpg` & orbiting **BepiColombo**.
     - **Stop 3 — Venus**: `2k_venus_atmosphere.jpg` & **Venera 13** heritage spacecraft.
     - **Stop 4 — Earth & Moon**: Custom GLSL day/night terminator shader (`EarthShader.ts`, `168L`) blending `2k_earth_daymap.jpg`, `2k_earth_nightmap.jpg`, `earth_normal.jpg`, `earth_spec.jpg`, independent `2k_earth_clouds.jpg` sphere, orbiting Moon (`moon.jpg`), plus **ISS** & **JWST**.
   - **Audio & UI (`src/audio/`, `src/ui/`)**:
     - 4-zone Web Audio crossfader (`WebAudioEngine.ts`, `192L` — `PAD`, `ASCENT`, `VOID_DRIFT`, `HAZARD_OVERRIDE`), hull-conducted thruster rumble, RCS & radar ping synthesis, and `CommsPlayer.ts` (`122L`) auto-ducking playing `public/audio/ship-welcome.mp3` on launch and `public/audio/sagan-real.mp3` on arrival with verbatim synced classroom captions.
     - Diegetic Homeworld bottom Sensor Bar (`HudController.ts`, `185L`), proximity holographic probe bracket, and attributed Sagan/Tyson arrival quote cards.
5. **Phase 5 — Build Verification & Push (`v2-rebuild`)**:
   - Verified `npm run build` (`tsc && vite build`) passes cleanly with zero TypeScript or Vite errors and all 25 files in `src/` strictly `< 200` lines.

---

## 3. Next Priorities (Slice 2 Roadmap)

1. **Stops 5–9 Outer System Expansion**:
   - Mars (`2k_mars.jpg` + Perseverance/Ingenuity orbital relay), Asteroid Belt instanced field, Jupiter (`2k_jupiter.jpg` + Juno + Galilean moons), Saturn (`2k_saturn.jpg` + ring shadow shader + Cassini), Uranus (`2k_uranus.jpg`), and Neptune (`2k_neptune.jpg` + Voyager 2).
2. **Optional External `.glb` Corvette Swap**:
   - Drop a custom low-poly PBR Corvette `.glb` into `CorvetteMesh.attachExternalHull()` while retaining procedural plumes, RCS puffs, and swiveling radar dish sockets.
