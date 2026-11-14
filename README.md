# Nebula Nomads · Space Mission Design Game

Pick one of four reference missions, design its launch, spacecraft, ground and user segments, then run a mission playback and score.

## Run it

The game loads its data from JSON, so serve the folder instead of double-clicking `index.html`:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Folder layout

```
index.html        page markup
css/              base, components, illustrations, info-panel styles
data/             all game content (one JSON list per catalogue)
Images/           mission and launch-vehicle photos
js/
  main.js         entry point
  data.js         loads the JSON files
  state.js        current choices and helpers
  calc.js         game rules: mass, power, cost, data, lifetime
  icons.js        SVG illustrations
  ui/             render, cards, hud, infopanel, simulate, timeline, starfield
```

## Editing the data

- Each `data/*.json` file is a list; add an item by copying an existing one.
- Objectives list their suitable orbits in `"orbits"` and instruments list the objectives they suit in `"fit"`.
- Mission photos are mapped in `MISSION_ART` and vehicle photos in `VEHICLE_ART`, both in `js/ui/render.js`.
- `reference-data.json` keeps the original supplied dataset for provenance; the game does not read it.

## Notes

Values come from the supplied reference dataset and are planning-level, educational figures, not engineering analysis. Range values use a midpoint, annual operating costs scale with mission length, and instrument stars and score multipliers are game mechanics.
