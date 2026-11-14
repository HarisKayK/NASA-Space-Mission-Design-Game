// "Launch mission" button: checks every requirement and works out the score.
import { $ } from "../state.js";
import { calc } from "../calc.js";

export function simulate() {
  const c = calc(),
    checks = [];
  const add = (ok, t) =>
    checks.push(
      `<div class="chk ${ok ? "ok" : "bad"}">${ok ? "✓" : "✗"} ${t}</div>`,
    );
  add(
    c.mass <= c.cap,
    c.mass <= c.cap
      ? `Launch: ${c.mass.toLocaleString()} of ${c.cap.toLocaleString()} kg.`
      : `Launch failed: ${c.mass.toLocaleString()} kg exceeds the ${c.cap.toLocaleString()} kg limit.`,
  );
  add(
    c.powUse <= c.gen,
    c.powUse <= c.gen
      ? "Power: enough for all systems."
      : `Power short: need ${c.powUse} W, have ${c.gen} W.`,
  );
  add(
    c.misfit == 0,
    c.misfit == 0
      ? "Payload: suits the objective."
      : `Payload: ${c.misfit} instrument(s) don’t suit the objective (30% value).`,
  );
  add(
    c.data <= c.down,
    c.data <= c.down
      ? `Data: all ${c.data} Gb/day returned.`
      : `Data loss: ${c.data} Gb/day collected, ${c.down} sent.`,
  );
  add(
    c.k.rel >= 1,
    c.k.rel >= 1
      ? "Control: fast fixes."
      : "Control: part-time team lowers reliability.",
  );
  add(
    c.u.mult >= 1,
    c.u.mult >= 1
      ? `Users: ${c.u.users.replace(" users", "")} reached.`
      : "Users: limited reach.",
  );
  add(
    c.orbOK,
    c.orbOK
      ? "Orbit suits the objective."
      : "Orbit doesn’t suit the objective.",
  );
  add(
    c.life >= c.months,
    c.life >= c.months
      ? `Lifetime: ${c.life} of ${c.months} mo.`
      : `Lifetime too short: ${c.life} of ${c.months} mo.`,
  );
  add(
    c.cost <= c.budget,
    c.cost <= c.budget
      ? `Budget: $${c.budget - c.cost}M left.`
      : `Over budget by $${c.cost - c.budget}M.`,
  );
  let s =
    c.sci *
    (c.orbOK ? 1 : 0.4) *
    Math.min(1, c.down / Math.max(c.data, 1)) *
    Math.min(1, c.life / c.months) *
    (c.powUse <= c.gen ? 1 : 0.3) *
    c.k.rel *
    c.u.mult;
  if (c.mass > c.cap || c.cost > c.budget) s = 0;
  const eff =
      c.cost <= c.budget
        ? Math.round(((c.budget - c.cost) / c.budget) * 20)
        : 0,
    sci = Math.round(s);
  const names = ["Launch", "Space", "Ground", "User"];
  $("out").innerHTML =
    `<div class="row"><div><div class="sub">Mission score</div><div class="score mono">${sci + eff}</div></div><div class="sub">Science ${sci} + budget efficiency ${eff}</div></div>` +
    `<div class="seglist">${Object.values(c.seg)
      .map(
        (v, i) =>
          `<div><b>${names[i]} segment</b><br><span class="mono">$${Math.round(v)}M</span></div>`,
      )
      .join("")}</div>` +
    `<h3 class="subh">Build &amp; verify: does the design meet each requirement?</h3>` +
    checks.join("");
}
