// Redraws the whole page from the current state.
import { $, S, TABS } from "../state.js";
import {
  OBJ,
  ORB,
  VEH,
  BUS,
  POW,
  COM,
  INS,
  GND,
  CTL,
  USR,
  SEGS,
  MAP,
} from "../data.js";
import { calc } from "../calc.js";
import { ICON, sv } from "../icons.js";
import { fill, opt } from "./cards.js";
import { hud } from "./hud.js";
import { renderBriefing } from "./briefing.js";


function renderSelectionSummary() {
  const chosen = [
    ["Objective", OBJ[S.obj]?.n],
    ["Orbit", ORB[S.orb]?.n],
    ["Launch vehicle", VEH[S.veh]?.n],
    ["Spacecraft bus", BUS[S.bus]?.n],
    ["Power", POW[S.pow]?.n],
    ["Communications", COM[S.com]?.n],
    ["Instruments", [...S.ins].map((i) => INS[i]?.n).filter(Boolean).join(", ") || "None selected"],
    ["Ground station", GND[S.gnd]?.n],
    ["Mission control", CTL[S.ctl]?.n],
    ["Data access", USR[S.usr]?.n],
  ];
  $("selection-summary").innerHTML = chosen.map(([label, value]) =>
    `<div class="selection-row"><span>${label}</span><strong>${value || "—"}</strong></div>`
  ).join("");
}

export function render() {
  const c = calc(),
    cs = [null, c.seg.launch, c.seg.space, c.seg.ground, c.seg.user, null];
  $("tabs").innerHTML = TABS.map(
    (t, i) =>
      `<button data-i="${i}" class="${i == S.tab ? "on" : ""}">${i + 1} · ${t}${cs[i] ? `<span class="cost">$${Math.round(cs[i])}M</span>` : ""}</button>`,
  ).join("");
  document
    .querySelectorAll(".panel")
    .forEach((p, i) => p.classList.toggle("on", i == S.tab));
  fill(
    "g-obj",
    OBJ,
    (i) => i == S.obj,
    (i) => (S.obj = i),
    (o) => [
      `$${o.budget}M`,
      `${o.months} mo`,
      "orbit: " + MAP[o.id].join("/"),
      o.disc,
    ],
  );
  fill(
    "g-orb",
    ORB,
    (i) => i == S.orb,
    (i) => (S.orb = i),
    (o) => [o.alt, "period " + o.per],
  );
  fill(
    "g-veh",
    VEH,
    (i) => i == S.veh,
    (i) => (S.veh = i),
    (o) => [
      "$" + o.cost + "M",
      "to orbit: " + (o.cap[ORB[S.orb].id] || 0).toLocaleString() + " kg",
    ],
    (o) => !o.cap[ORB[S.orb].id],
  );
  fill(
    "g-bus",
    BUS,
    (i) => i == S.bus,
    (i) => (S.bus = i),
    (o) => [
      o.mass + " kg",
      "$" + o.cost + "M",
      o.load + " W load",
      o.life + " mo life",
    ],
  );
  fill(
    "g-pow",
    POW,
    (i) => i == S.pow,
    (i) => (S.pow = i),
    (o) => [o.mass + " kg", o.gen + " W", "$" + o.cost + "M"],
  );
  fill(
    "g-com",
    COM,
    (i) => i == S.com,
    (i) => (S.com = i),
    (o) => [o.mass + " kg", o.pow + " W", o.rate + " Mbps", "$" + o.cost + "M"],
  );
  fill(
    "g-ins",
    INS,
    (i) => S.ins.has(i),
    (i) => (S.ins.has(i) ? S.ins.delete(i) : S.ins.add(i)),
    (o) => [
      o.mass + " kg",
      o.pow + " W",
      "$" + o.cost + "M",
      o.data + " Gb/d",
      "★" + o.sci,
    ],
  );
  fill(
    "g-gnd",
    GND,
    (i) => i == S.gnd,
    (i) => (S.gnd = i),
    (o) => ["$" + o.cost + "M", "≈" + o.h + " h/day"],
  );
  fill(
    "g-ctl",
    CTL,
    (i) => i == S.ctl,
    (i) => (S.ctl = i),
    (o) => ["$" + o.cost + "M", "reliability " + Math.round(o.rel * 100) + "%"],
  );
  fill(
    "g-usr",
    USR,
    (i) => i == S.usr,
    (i) => (S.usr = i),
    (o) => ["$" + o.cost + "M", o.users, "impact ×" + o.mult],
  );
  $("flow").innerHTML = "";
  SEGS.forEach((s, i) => {
    const b = opt(
      { n: s.n, d: s.d },
      false,
      () => {
        S.tab = i + 1;
        render();
      },
      ["$" + Math.round(Object.values(c.seg)[i]) + "M"],
      false,
      sv(ICON.seg(i)),
    );
    b.querySelector("h3").dataset.n = i + 1;
    $("flow").appendChild(b);
  });
  renderBriefing(c);
  hud();
  renderSelectionSummary();
}
