// Game rules: turns the chosen parts into mass, power, cost, data and lifetime numbers.
import { S } from "./state.js";
import {
  OBJ,
  BUS,
  POW,
  COM,
  ORB,
  VEH,
  GND,
  CTL,
  USR,
  INS,
  MAP,
} from "./data.js";

export function calc() {
  const o = OBJ[S.obj],
    bu = BUS[S.bus],
    p = POW[S.pow],
    c = COM[S.com],
    orb = ORB[S.orb],
    v = VEH[S.veh],
    g = GND[S.gnd],
    k = CTL[S.ctl],
    u = USR[S.usr];
  const ins = [...S.ins].map((i) => INS[i]),
    sum = (x) => ins.reduce((a, b) => a + b[x], 0);
  const missionYears = o.months / 12;
  const lifecycleCost = (item) => item.cost * (item.annual ? missionYears : 1);
  const seg = {
    launch: v.cost,
    space: bu.cost + p.cost + c.cost + sum("cost"),
    ground: lifecycleCost(g) + lifecycleCost(k),
    user: lifecycleCost(u),
  };
  const hours = Math.min(24, g.h);
  const sci = ins.reduce(
    (a, i) => a + i.sci * (i.fit.includes(o.id) ? 1 : 0.3),
    0,
  );
  const misfit = ins.filter((i) => !i.fit.includes(o.id)).length;
  return {
    o,
    orb,
    v,
    g,
    k,
    u,
    seg,
    hours,
    sci,
    misfit,
    rawSci: sum("sci"),
    mass: Math.round(bu.mass + p.mass + c.mass + sum("mass")),
    cap: v.cap[orb.id] ?? null,
    launchVerified: v.cap[orb.id] != null,
    launchCapacityNote: v.capNotes?.[orb.id] || "Payload capacity for this trajectory is not included in the supplied dataset.",
    powUse: Math.round(bu.load + c.pow + sum("pow")),
    gen: p.gen,
    cost: Math.round(seg.launch + seg.space + seg.ground + seg.user),
    budget: o.budget,
    data: Math.round(sum("data")),
    down: Math.round(c.rate * hours * 3.6),
    life: Math.round(bu.life * orb.life),
    months: o.months,
    orbOK: MAP[o.id].includes(orb.id),
  };
}

// Requirements list: [met?, text, how it is verified]
export function reqs(c) {
  return [
    [
      c.cap == null ? null : c.mass <= c.cap,
      c.cap == null
        ? "Launch payload capacity not supplied for this trajectory"
        : `Mass ≤ ${c.cap.toLocaleString()} kg (rocket limit)`,
      c.cap == null
        ? "verify the launcher’s heliocentric-injection performance"
        : "add up the part masses",
    ],
    [
      c.powUse <= c.gen,
      `Power use ≤ ${c.gen} W`,
      "add up the loads, compare to array output",
    ],
    [
      c.data <= c.down,
      `Return all ${c.data} Gb/day of data`,
      "compare data made to data sent down",
    ],
    [
      c.life >= c.months,
      `Work for ${c.months} months`,
      "compare design life to mission length",
    ],
    [c.cost <= c.budget, `Cost ≤ $${c.budget}M`, "add up the segment costs"],
    [c.orbOK, "Orbit suits the objective", "check the objective’s orbit list"],
    [
      c.misfit == 0,
      "Every instrument suits the objective",
      "check each instrument’s fit",
    ],
  ];
}
