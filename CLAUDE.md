# CLAUDE.md — Solar Explorer V2 Architectural Contract & Workspace Rules

> **TOP RULE — DUAL-ENGINE CONTINUITY PROTOCOL (MANDATORY)**
> 1. **Read First**: At the start of **every** session or task, you **MUST** read `STATE.md` to load the current project state, active work, known bugs, and next priorities.
> 2. **Update Last**: Before finishing **any** task that modifies code, fixes a bug, alters architecture, or shifts priorities, you **MUST** update `STATE.md` (and keep `CLAUDE.md` and `GEMINI.md` synchronized if architectural facts change).

---

## 1. Core Creative & Engineering Pillars (V2 Contract)

1. **Fictional Ship, Factual Universe**:
   - You pilot an industrial deep-space reconnaissance Corvette through a scientifically grounded Solar System.
   - **Zero trivia modals**, **zero blocking popups**, and **zero browser Web Speech TTS (`window.speechSynthesis`)**.
   - All learning happens diegetically through live telemetry, physical proximity to real historic spacecraft, attributed archival audio (`public/audio/sagan-real.mp3`, `public/audio/ship-welcome.mp3`) with synced classroom captions, and non-blocking attributed Sagan/Tyson arrival quote cards.
2. **Tri-Pillar Aesthetic Direction**:
   - **Homeworld Tactical Sensors Manager**: Crisp diegetic sensor brackets, subtle cyan orbital tour ribbon, 1-click bottom Sensor Bar, and tabular telemetry readouts.
   - **The Expanse Mechanical Realism**: 180-degree flip-and-burn deceleration braking on approach, directional crisp RCS thruster puffs on pitch/yaw/flip, hull-conducted thruster rumble, and G-load feedback.
   - **Firefly Frontier Grit**: Warm tungsten-amber (`#f59e0b`) and slate-cyan (`#38bdf8`) accents over deep void (`#05080f`), matte gunmetal hull plating with exposed radiators, and self-hosted `Orbitron` typography (`public/fonts/`).
3. **Strict 200-Line Modularity Guardrail**:
   - **HARD LIMIT**: Every single file inside `src/` **MUST** stay strictly **under 200 lines**. Split shaders, meshes, data catalogs, audio nodes, and UI controllers into focused modules rather than growing monoliths.
4. **Minimalist, Offline-First Dependency Lock**:
   - `package.json` uses **ONLY** `three`, `@types/three`, `zustand`, `typescript`, and `vite`.
   - `vite.config.ts` enforces `base: './'` so static builds deploy cleanly to GitHub Pages or offline classroom servers with zero external CDN requests.

---

## 2. Build, Run & Verification Commands

```powershell
# Install locked dependency set
npm install

# Type-check (strict ES2022) and build static bundle into dist/
npm run build

# Start Vite local development server
npm run dev

# Audit 200-line hard limit across src/
Get-ChildItem -Recurse -File src | ForEach-Object {
  [PSCustomObject]@{ File = $_.FullName; Lines = (Get-Content $_.FullName).Count }
} | Sort-Object Lines -Descending
```

---

## 3. Repository Architecture (`v2-rebuild`)

```text
C:\SolarExplorer\
├── index.html                  # Tactile viewport shell & diegetic HUD mount points
├── package.json                # Locked to three, @types/three, zustand, typescript, vite
├── tsconfig.json               # Strict ES2022 TypeScript configuration
├── vite.config.ts              # Static relative build (base: './')
├── STATE.md                    # Single source of truth for V2 progress & next slices
├── CLAUDE.md / GEMINI.md       # Synchronized V2 architectural guardrails
├── public/
│   ├── .nojekyll               # GitHub Pages static bypass
│   ├── favicon.ico / .svg      # App icons
│   ├── audio/                  # Mastered archival/ship mp3 & ogg tracks
│   ├── fonts/                  # Self-hosted Orbitron variable woff2 + css
│   └── textures/               # NASA 2K planetary, cloud, normal, spec & lunar maps
└── src/                        # EVERY FILE < 200 LINES
    ├── main.ts                 # Renderer bootstrap & 60 FPS simulation loop
    ├── core/                   # Zustand vanilla store, FloatingOrigin, Dual-Scale math
    ├── data/                   # Stops 1–4 astrophysical data, probes, synced captions
    ├── flight/                 # CorvetteMesh (.glb-ready), InputRouter, ChaseCamera, Autopilot
    ├── world/                  # Sun GLSL, Earth terminator GLSL, ProbeMeshes, Launchpad, Scene
    ├── telemetry/              # Live range/velocity/G-load & screen-projected probe brackets
    ├── audio/                  # 4-zone Web Audio crossfader, hull rumble, Comms auto-ducking
    └── ui/                     # Diegetic Sensor Bar, HUD styles, quote cards, captions
```

---

## 4. Branch & Deployment Safety
- `main`: Live V1 GitHub Pages deployment (kept intact until V2 playtest sign-off).
- `v1-legacy`: Frozen complete V1 archive including Oct 23 audio and 2K texture assets.
- `v2-rebuild`: Active V2 modular TypeScript + Vite vertical slices.
