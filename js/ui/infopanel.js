import { $, S } from "../state.js";
import { OBJ, ORB, INS, MAP, LISTS } from "../data.js";
import { calc } from "../calc.js";
import { KIND } from "./cards.js";

// Side panel with details and fit verdicts (hover or keyboard focus)
const info = $("insinfo");
function hideInfo() {
  info.classList.remove("on");
}
const orbNames = (o) =>
  MAP[o.id]
    .map((id) => ORB.find((y) => y.id == id).n.toLowerCase())
    .join(" or ");
// What would happen if this option were picked, with everything else as it is now
function fitOf(k, i) {
  const o = OBJ[S.obj];
  if (k == "obj") return null;
  if (k == "ins") {
    const n = INS[i];
    return n.fit.includes(o.id)
      ? ["ok", "Good fit for this objective."]
      : ["warn", `Weak fit for ${o.n} (30% value).`];
  }
  const keep = S[k];
  S[k] = i;
  const c = calc();
  S[k] = keep;
  const x = LISTS[k][i],
    L = (n) => n.toLocaleString();
  switch (k) {
    case "orb":
      return c.orbOK
        ? ["ok", `Suits ${o.n}.`]
        : ["no", `Doesn’t suit ${o.n}. It needs ${orbNames(o)}.`];
    case "veh": {
      const cap = x.cap[c.orb.id];
      if (cap == null)
        return ["warn", `${x.capNotes?.[c.orb.id] || "Payload performance for this injection is not in the supplied data."} Launch mass cannot be verified.`];
      if (!MAP[o.id].some((id) => x.cap[id] > 0))
        return ["no", `Can’t reach the orbit ${o.n} needs.`];
      if (!cap)
        return ["no", `Can’t reach the ${c.orb.n.toLowerCase()} you picked.`];
      return c.mass > cap
        ? [
            "no",
            `Too heavy: your design is ${L(c.mass)} kg, it lifts ${L(cap)} kg.`,
          ]
        : ["ok", `Lifts your ${L(c.mass)} kg design (limit ${L(cap)} kg).`];
    }
    case "bus":
      return c.life >= c.months
        ? ["ok", `Lasts ${c.life} months. ${o.n} needs ${c.months}.`]
        : [
            "no",
            `Too short: lasts ${c.life} months, ${o.n} needs ${c.months}.`,
          ];
    case "pow":
      return c.powUse <= c.gen
        ? ["ok", `Makes ${L(c.gen)} W. Your design uses ${L(c.powUse)} W.`]
        : [
            "no",
            `Too little: makes ${L(c.gen)} W, your design needs ${L(c.powUse)} W.`,
          ];
    case "com":
    case "gnd":
      return c.data <= c.down
        ? [
            "ok",
            `Sends back ${L(c.down)} Gb/day. Your instruments make ${L(c.data)}.`,
          ]
        : [
            "warn",
            `Sends only ${L(c.down)} Gb/day. Your instruments make ${L(c.data)}, so data is lost.`,
          ];
    case "ctl":
      return x.rel >= 0.99
        ? ["ok", `High reliability (${(x.rel * 100).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}%).`]
        : ["warn", `Reduced response. Reliability ${(x.rel * 100).toFixed(0)}%; score ×${x.rel}.`];
    case "usr":
      return x.mult >= 1
        ? ["ok", `Reaches ${x.users}. Score ×${x.mult}.`]
        : ["warn", `Limited reach. Score ×${x.mult}.`];
  }
}
function showInfo(card, k) {
  const i = [...card.parentNode.children].indexOf(card),
    x = LISTS[k][i];
  if (!x) return;
  const f = fitOf(k, i),
    strip = (s) => s.replace(/ \(.*\)/, "");
  const title = k === "obj" ? (x.representativeMission || x.n) : x.n;
  let b = `<h4>${title}</h4><p>${x.use || x.need || x.d || ""}</p>`;
  if (k == "ins")
    b += `<div class="k">Measures</div><p>${x.meas}</p><div class="k">Best for</div><p>${x.fit.map((id) => OBJ.find((y) => y.id == id).n).join(", ")}</p>`;
  if (k == "obj")
    b += `<div class="k">Science goals</div><p>${x.goals.join(" · ")}</p><div class="k">Recommended orbit</div><p>${orbNames(x)}</p><div class="k">Compatible instruments</div><p>${INS.filter(
      (n) => n.fit.includes(x.id),
    )
      .map((n) => strip(n.n))
      .join(", ")}</p>`;
  if (x.sourceSpecs?.length)
    b += `<div class="k">Reference data</div><p>${x.sourceSpecs.join("<br>")}</p>`;
  if (f)
    b += `<p class="fit${f[0]}">${{ ok: "✓", warn: "⚠", no: "✗" }[f[0]]} ${f[1]}</p>`;
  info.innerHTML = b;
  const r = card.getBoundingClientRect(),
    w = 280,
    g = 12,
    h = info.offsetHeight;
  let px = r.right + g,
    py = r.top;
  if (px + w > innerWidth - 8) px = r.left - g - w;
  if (px < 8) {
    px = Math.max(8, Math.min(r.left, innerWidth - w - 8));
    py = r.bottom + 8;
    if (py + h > innerHeight - 8) py = r.top - h - 8;
  }
  py = Math.max(8, Math.min(py, innerHeight - h - 8));
  info.style.left = px + "px";
  info.style.top = py + "px";
  info.classList.add("on");
}
export function initInfoPanel() {
  for (const id in KIND) {
    const g = $(id);
    for (const ev of ["mouseover", "focusin"])
      g.addEventListener(ev, (e) => {
        const c = e.target.closest(".opt");
        if (c) showInfo(c, KIND[id]);
      });
    for (const ev of ["mouseleave", "focusout"])
      g.addEventListener(ev, hideInfo);
  }
  addEventListener("scroll", hideInfo, true);
}
