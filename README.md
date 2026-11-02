# Codon

A biology game about one bacterium and its genes, built with three.js. This is the first prototype: it sets the mood and the feel of swimming. There is no gameplay loop yet.

You control a rod-shaped bacterium (E. coli-like, 1 × 2 µm) inside a drop of water. The cell's envelope is a translucent, wobbling jelly, and through it you see its insides painted the way David Goodsell paints them: blue and violet proteins packed tight, magenta ribosomes, the yellow tangle of the nucleoid, a supercoiled plasmid and the chemoreceptor array at the front pole.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

`npm run build` writes a static site to `dist/`.

## Controls

| Key | Does |
|---|---|
| W A S D | Swim toward where you look (the reticle sits a little above the cell) |
| Space / C | Rise / sink |
| Q / E | Roll |
| F | Tumble: the flagella splay and the cell flips to a new heading |
| Drag, wheel | Look around, zoom |
| Tab | Inspect: slows time, moves in close and labels the cell's parts and the water |

## What's modelled

- **Scale.** One unit is one micrometre. The scale bar under the cell is exactly 1 µm at the cell's depth.
- **Low Reynolds number.** At this size water behaves like syrup: there is no coasting, so speed follows the motors almost instantly. The body slowly counter-rotates against its spinning flagella.
- **Run and tumble.** Running, the flagella spin together in a bundle behind the cell. Tumbling, they reverse and splay apart. Neighbouring rods do this on their own. The cocci (round cells) can't swim and only drift.
- **Energy.** Swimming spends ATP and resting regenerates it. With almost no ATP the cell can only crawl.

## The interface lives in the water

There is no screen-space HUD. The vitals ring (ATP in mint, envelope integrity in paper), the scale bar and speed float around the cell. Inspect tags are pinned to the parts they name. The title and control hints float where you start, and you swim past them.

## Layout

| File | What |
|---|---|
| `src/main.js` | Renderer, camera, post-processing, the frame loop |
| `src/bacterium.js` | The cell: jelly envelope, Goodsell interior, flagella. Also the simpler neighbours and cocci |
| `src/materials.js` | The Goodsell shader, the jelly material, the envelope rim |
| `src/water.js` | The drop: light from above, caustics, particles with depth of field, light shafts |
| `src/player.js` | Input and swimming physics |
| `src/neighbours.js` | Other microbes and how they move |
| `src/hud.js` | The in-world interface |
| `src/lens.js` | Final pass: colour fringing, vignette, grain |
| `src/palette.js` | Goodsell colours for biology, Holarky colours for interface |

## Debug switches

Add to the URL: `?inspect` starts in inspect mode, `?keys=KeyW,KeyA` holds keys from the start, `?frames=N` renders N fixed steps and stops (for screenshots on slow software renderers).

The icon in `public/brand/` is the Holarky family letter c, copied from the holarky-account brand folder.

## Screenshots

Rendered in headless Chromium with a software renderer, so the grain and softness are a little heavier than on a GPU.

| Start | Swimming | Inspect |
|---|---|---|
| ![Start](docs/start.jpg) | ![Swimming](docs/swimming.jpg) | ![Inspect](docs/inspect.jpg) |
