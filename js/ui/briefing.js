// Mission panel extras: need and goals, concept of operations, requirements, real missions.
import { $, S } from "../state.js";
import { INS, BUS, EX } from "../data.js";
import { reqs } from "../calc.js";

export function renderBriefing(c) {
  const o = c.o;
  $("brief").innerHTML =
    `<div class="ref">${o.disc} · mission need</div><p class="briefp">${o.need}</p><div class="tags">${o.goals.map((g, i) => `<span>Goal ${i + 1}: ${g}</span>`).join("")}</div>`;
  const ins = [...S.ins].map((i) => INS[i].n.replace(/ \(.*\)/, ""));
  $("conops").innerHTML = [
    [
      "Launch",
      `${c.v.n} lifts ${c.mass.toLocaleString()} kg to the ${c.orb.n.toLowerCase()} (${c.orb.alt}).`,
    ],
    [
      "Operate",
      `The ${BUS[S.bus].n.toLowerCase()} runs ${ins.length ? ins.join(", ") : "no instruments"} for ${c.life} months.`,
    ],
    [
      "Ground",
      `${c.g.n} gets about ${c.hours} h/day of contact. ${c.k.n} runs the mission.`,
    ],
    ["Users", `${c.u.n}: ${c.u.users}.`],
  ]
    .map((x, i) => `<div><b>${i + 1}. ${x[0]}</b><br>${x[1]}</div>`)
    .join("");
  $("reqs").innerHTML = reqs(c)
    .map(
      (r) =>
        `<div class="chk ${r[0] ? "ok" : "bad"}">${r[0] ? "✓" : "✗"} ${r[1]}<span class="ver"> · verify: ${r[2]}</span></div>`,
    )
    .join("");
  $("ex").innerHTML = EX.map(
    (e) =>
      `<a class="opt" href="${e.u}" target="_blank" rel="noopener"><h3>${e.n}</h3><p>${e.d}</p></a>`,
  ).join("");
}
