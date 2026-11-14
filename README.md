# Mission Control · Space Mission Design Game

Design a NASA-style science mission: pick an objective, then choose the launch, space, ground and user segments, and simulate it.

## Run it

The game loads its data from JSON files, so open it through a small local web server (double-clicking `index.html` will not work):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Folder layout

```
index.html          page markup
css/
  base.css          colour variables, reset, typography, page layout
  components.css    cards, HUD, tabs, option cards, buttons, checks
  illustrations.css SVG pictures, mission diagram, animations
  info-panel.css    hover panel next to the cards
data/               all game content (edit these to change the game)
  objectives.json   mission goals: budget, months, suitable orbits, need and goals
  orbits.json  vehicles.json  buses.json  power.json  comms.json
  instruments.json  ground.json  control.json  users.json
  segments.json     the four mission segments
  missions.json     "real missions to study" links
  tips.json         tip shown under each tab
js/
  main.js           entry point: loads data, wires up the page
  data.js           loads the JSON files
  state.js          current choices (S), tab names, helpers
  calc.js           game rules: mass, power, cost, data, lifetime, requirements
  icons.js          all the SVG illustrations
  ui/
    render.js       redraws the page      cards.js     option cards
    hud.js          top meters            viz.js       mission diagram
    briefing.js     need, ConOps, requirements, missions
    simulate.js     "Launch mission" results
    infopanel.js    hover info and fit verdicts
    starfield.js    animated background
```

## Editing the data

- Each `data/*.json` file is a list. Add an item by copying an existing one.
- **Order matters for pictures.** `js/icons.js` picks each card's illustration by its position in the list, so a new item needs a new picture added there at the same position.
- Objectives list their suitable orbits in `"orbits"` (ids from `orbits.json`).
- Instruments say which objectives they suit in `"fit"` (objective ids).
- Numbers marked `≈` in `"ref"` are estimates or game simplifications.
