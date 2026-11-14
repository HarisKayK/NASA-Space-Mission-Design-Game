// Entry point: load data, wire up the page, draw it.
import { $, S } from "./state.js";
import { loadData } from "./data.js";
import { render } from "./ui/render.js";
import { simulate } from "./ui/simulate.js";
import { onPick } from "./ui/cards.js";
import { initInfoPanel } from "./ui/infopanel.js";
import { startStarfield } from "./ui/starfield.js";

$("tabs").onclick = (e) => {
  const b = e.target.closest("button");
  if (b) {
    S.tab = +b.dataset.i;
    render();
  }
};
$("run").onclick = simulate;

async function start() {
  startStarfield();
  try {
    await loadData();
  } catch (err) {
    console.error(err);
    $("hud").innerHTML =
      `<div class="card">Could not load the game data. Open the page through a local web server (see README.md).<br><span class="sub">${err.message}</span></div>`;
    return;
  }
  onPick(render);
  initInfoPanel();
  render();
}
start();
