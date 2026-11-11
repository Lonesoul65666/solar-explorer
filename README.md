# Solar Explorer V2

**Fictional Ship, Factual Universe.**  
An interactive 60 FPS 3D tactical spaceflight and solar-system planetarium built with **Three.js**, **TypeScript (strict ES2022)**, **Zustand**, and **Vite**.

## Aesthetic & Design Contract
- **Homeworld Tactical Sensors Manager**: Diegetic bottom Sensor Bar, subtle `#38bdf8` cyan tour ribbon, proximity holographic probe brackets, and Explorer/Pro telemetry.
- **The Expanse Mechanical Realism**: 4-second star-streak Pulse Jump followed by a 180-degree flip-and-burn deceleration approach, directional crisp RCS thruster puffs, and hull-conducted thruster rumble.
- **Firefly Frontier Grit**: Tungsten-amber (`#f59e0b`) and slate-cyan (`#38bdf8`) over deep void (`#05080f`), matte gunmetal Corvette hull with exposed radiator vanes, and self-hosted `Orbitron` typography.
- **Zero Modals / Zero Live TTS**: Zero trivia popups, zero blocking overlays, and zero `window.speechSynthesis`. Mastered archival audio (`public/audio/sagan-real.mp3`, `public/audio/ship-welcome.mp3`) plays with Web Audio auto-ducking and verbatim synced classroom captions.
- **Strict Modularity**: Every file inside `src/` stays strictly under **200 lines**.

## Quickstart
```bash
npm install
npm run dev
```

## Production Static Build (GitHub Pages Ready, `base: './'`)
```bash
npm run build
npm run preview
```
