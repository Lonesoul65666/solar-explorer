# Solar Explorer

An interactive, browser-based tour of the solar system — built to be genuinely
fun for a curious kid, and usable by a teacher with a projector and no setup.

Click any planet to explore it. Scroll to zoom, drag to orbit, press `?` for
keyboard shortcuts.

## Running it

There is no build step and no dependencies to install. Any static web server
works:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` will **not** work — the app is an
ES module, and browsers block module loading from the filesystem. It needs to be
served over HTTP.

## Design constraints

These are deliberate, and worth preserving:

- **No build step.** Plain HTML, CSS, and ES modules. Clone and serve.
- **No network dependencies at runtime.** three.js and the Orbitron font are
  vendored in `vendor/`. The app has been verified to run with *all* external
  requests blocked — important because school and corporate networks routinely
  block CDNs, and because it means the app works offline or off a USB stick.
- **No accounts, no tracking, no analytics.** Nothing is collected. This matters
  if a school is going to allow it.
- **Audio is synthesised, not streamed.** The ambient score and all sound
  effects are generated in the Web Audio API, so there are no audio files.

## Layout

```
index.html              the app (single page)
universe.js             all application logic
universe.css            all styling
textures/               planet surface maps (NASA-derived, public domain)
vendor/three/           three.js r165, vendored
vendor/fonts/           Orbitron (SIL OFL 1.1), self-hosted
```

## Hosting on GitHub Pages

Settings → Pages → Source: **Deploy from a branch**, branch `main`, folder
`/ (root)`. The app is the repository root `index.html`, so it serves at the
bare URL with no path suffix.

> Worth knowing: in the previous repository, Pages was accidentally pointed at
> an unrelated branch, so the published site served a different project entirely
> and every solar-system asset 404'd. If the page looks wrong after deploying,
> check the source branch first.

## Credits

- Planet textures derived from NASA imagery (public domain).
- [Orbitron](https://fonts.google.com/specimen/Orbitron) by Matt McInerney,
  SIL Open Font License 1.1.
- [three.js](https://threejs.org) r165, MIT License.
