import { $ } from "../state.js";
import { calc } from "../calc.js";

function res(l, val, pct, bad, calm) {
  return `<div class="card res"><div class="lbl">${l}</div><div class="val mono">${val}</div><div class="bar"><i style="width:${Math.min(100, pct)}%;background:${bad ? "var(--bad)" : !calm && pct > 85 ? "var(--warn)" : "var(--ok)"}"></i></div></div>`;
}
export function hud() {
  const c = calc();
  $("hud").innerHTML =
    res(
      "Mass",
      c.cap == null ? `${c.mass.toLocaleString()} kg · capacity n/a` : `${c.mass.toLocaleString()} / ${c.cap.toLocaleString()} kg`,
      c.cap == null ? 0 : (c.mass / Math.max(c.cap, 1)) * 100,
      c.cap != null && c.mass > c.cap,
      c.cap == null,
    ) +
    res(
      "Power",
      `${c.powUse} / ${c.gen} W`,
      (c.powUse / c.gen) * 100,
      c.powUse > c.gen,
    ) +
    res(
      "Budget",
      `$${c.cost} / ${c.budget} M`,
      (c.cost / c.budget) * 100,
      c.cost > c.budget,
    ) +
    res(
      "Data / day",
      `${c.data} / ${c.down} Gb`,
      (c.data / c.down) * 100,
      c.data > c.down,
    ) +
    res(
      "Lifetime",
      `${c.life} / ${c.months} mo`,
      (c.life / c.months) * 100,
      c.life < c.months,
      true,
    );
}
