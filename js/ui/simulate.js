// Runs the design checks, calculates the score, and plays out a design-dependent mission timeline.
import { $, calm } from "../state.js";
import { calc } from "../calc.js";
import { buildTimeline, buildReport } from "./timeline.js";

const names = ["Launch", "Space", "Ground", "User"];
let playbackTimer = null;

function renderMissionScene(result) {
  return `<div class="mission-scene stage-0 ${result.launchOK === false ? "launch-failed" : ""}" id="mission-scene" aria-label="Animated illustration of the mission progressing from launch to data delivery">
    <div class="scene-topline"><span id="scene-phase">01 / 06 · LAUNCH</span><span class="scene-status" id="scene-status"></span></div>
    <svg class="mission-art" viewBox="0 0 760 260" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="earthGlow"><stop stop-color="#4f8cff" stop-opacity=".34"/><stop offset="1" stop-color="#4f8cff" stop-opacity="0"/></radialGradient>
        <linearGradient id="earthFill" x2="0" y2="1"><stop stop-color="#3e8fe8"/><stop offset="1" stop-color="#142d65"/></linearGradient>
        <linearGradient id="rocketBody" x2="1" y2="0"><stop stop-color="#aebfdf"/><stop offset=".48" stop-color="#f5f7ff"/><stop offset="1" stop-color="#aab9d8"/></linearGradient>
        <linearGradient id="rocketExhaust" x2="0" y2="1"><stop stop-color="#fff0a6"/><stop offset=".45" stop-color="#ffad55"/><stop offset="1" stop-color="#ff6b55" stop-opacity="0"/></linearGradient>
      </defs>
      <circle cx="390" cy="315" r="190" fill="url(#earthGlow)"/><circle cx="390" cy="315" r="150" fill="url(#earthFill)"/><path d="M252 278 Q300 240 340 266 T425 266 T525 290" fill="none" stroke="#7bd6ff" stroke-opacity=".5" stroke-width="3"/>
      <ellipse class="orbit-track" cx="390" cy="175" rx="270" ry="82" fill="none" stroke="#8ca8ff" stroke-opacity=".0" stroke-width="1.5" stroke-dasharray="3 9"/>
      <g class="rocket-object">
        <path d="M180 79 C169 91 163 111 163 137 L163 181 Q163 190 171 194 L189 194 Q197 190 197 181 L197 137 C197 111 191 91 180 79Z" fill="url(#rocketBody)" stroke="#dce7ff" stroke-width="1.4"/>
        <path d="M180 79 C173 87 168 97 166 109 L194 109 C192 97 187 87 180 79Z" fill="#ffb86b"/>
        <path d="M163 157 L148 181 Q146 185 151 185 L166 181Z" fill="#6e8fc9" stroke="#9bb5e8" stroke-width="1"/>
        <path d="M197 157 L212 181 Q214 185 209 185 L194 181Z" fill="#6e8fc9" stroke="#9bb5e8" stroke-width="1"/>
        <path d="M180 194 L172 211 L180 207 L188 211Z" fill="#b8c9e8"/>
        <path d="M180 119 C173 119 169 125 169 132 C169 139 173 144 180 144 C187 144 191 139 191 132 C191 125 187 119 180 119Z" fill="#73dfff" stroke="#d8f7ff" stroke-width="2"/>
        <path d="M171 151 H189 M171 160 H189" stroke="#9eafd0" stroke-width="1.4" opacity=".8"/>
        <path class="rocket-flame" d="M171 193 Q175 218 180 236 Q185 218 189 193Z" fill="url(#rocketExhaust)"/>
        <path class="rocket-flame-core" d="M176 193 Q178 207 180 216 Q183 207 184 193Z" fill="#fff0b0"/>
      </g>
      <g class="satellite-object"><rect x="365" y="92" width="48" height="26" rx="5" fill="#d8e3ff"/><rect x="309" y="96" width="49" height="18" fill="#477bd1" stroke="#9bc4ff"/><path d="M309 96v18m12-18v18m12-18v18m12-18v18m12-18v18" stroke="#9bc4ff" stroke-opacity=".7"/><rect x="420" y="96" width="49" height="18" fill="#477bd1" stroke="#9bc4ff"/><path d="M420 96v18m12-18v18m12-18v18m12-18v18m12-18v18" stroke="#9bc4ff" stroke-opacity=".7"/><path d="M389 92V76l-8-8m8 8 8-8" stroke="#e8efff" stroke-width="3" fill="none"/><circle cx="389" cy="105" r="5" fill="#ffcf7d"/></g>
      <g class="ground-object"><path d="M624 216v-48m-12 48h24m-18-34 6-10 6 10" stroke="#b8c8ff" stroke-width="4" fill="none"/><path d="M604 168q20-23 40 0" stroke="#75d8ff" stroke-width="2" fill="none"/><path d="M594 152q30-34 60 0" stroke="#75d8ff" stroke-opacity=".45" stroke-width="2" fill="none"/></g>
      <path class="data-beam" d="M465 111 Q550 90 624 170" fill="none" stroke="#68e0c0" stroke-width="3" stroke-dasharray="7 7"/>
      <g class="scene-stars" fill="#dce7ff"><circle cx="90" cy="55" r="2"/><circle cx="240" cy="35" r="1.5"/><circle cx="550" cy="52" r="2"/><circle cx="680" cy="92" r="1.5"/><circle cx="720" cy="35" r="2"/><circle cx="290" cy="145" r="1.5"/></g>
    </svg>
    <div class="scene-progress" aria-hidden="true"><span id="scene-progress-fill"></span></div>
  </div>`;
}

const sceneStages = [
  ["01 / 06 · LAUNCH", "Vehicle ignition · ascent and stage separation"],
  ["02 / 06 · ORBIT", "Orbital insertion · establishing the mission trajectory"],
  ["03 / 06 · CHECKOUT", "Commissioning · power and communications checks"],
  ["04 / 06 · SCIENCE", "Science operations · instruments collecting observations"],
  ["05 / 06 · DOWNLINK", "Data downlink · transmitting observations to Earth"],
  ["06 / 06 · REVIEW", "Mission review · evaluating objectives and performance"]
];

const statusLabel = { success: "Nominal", warning: "Degraded", failed: "Failed", blocked: "Blocked" };

// The score and report stay hidden until the mission reaches its review phase.
function showResults(rep, on) {
  $("score-val").textContent = on ? rep.total : "…";
  $("score-sub").textContent = on ? `Science ${rep.sci} + budget efficiency ${rep.eff}` : "Revealed when the mission ends";
  $("score-val").classList.toggle("score-reveal", on);
  $("mission-report").hidden = !on;
}

function renderReport(r) {
  if (!r.hardFail.length && !r.noScience && !r.rows.some((x) => x.bonus || x.gain > 0)) return "";
  const lead = r.hardFail.length
    ? `<p class="report-lead bad">Your science score is 0 because ${r.hardFail.join(" and ")}. Fix that first. The points below show what each part is worth after that.</p>`
    : r.noScience
      ? `<p class="report-lead bad">No instruments were chosen, so there is no science.</p>`
      : `<p class="report-lead">${r.base === r.sci ? `Science ${r.sci}` : `Instruments ${r.base} → ${r.sci} after your other choices`}, plus ${r.eff} for money left over.</p>`;
  const rows = r.rows.length
    ? r.rows.filter((x) => x.bonus || x.gain > 0).map((x) => `<div class="report-row"><b>${x.name}</b><span class="mono ${x.bonus ? "up" : "down"}">×${x.mult}</span><span>${x.bonus ? "Bonus for wide reach." : `${x.tip} <em>+${x.gain} points</em>`}</span></div>`).join("")
    : `""`;
  const best = r.rows.find((x) => x.gain > 0);
  return `<h3 class="subh">Mission report</h3>${lead}${rows}${best ? `<p class="report-next"><b>Best next fix:</b> ${best.tip} (+${best.gain} points)</p>` : ""}`;
}

function startPlayback(result, rep) {
  if (playbackTimer) clearInterval(playbackTimer);
  const scene = $("mission-scene");
  const steps = [...document.querySelectorAll(".timeline-step")];
  const phaseLabel = $("scene-phase");
  const status = $("scene-status");
  const fill = $("scene-progress-fill");
  const replay = $("replay-mission");
  if (!scene || !steps.length) return showResults(rep, true);
  const last = sceneStages.length - 1;
  let current = 0;
  const paint = () => {
    const st = result.phases[current].status;
    scene.className = `mission-scene stage-${current} status-${st}${result.launchOK === false ? " launch-failed" : ""}`;
    phaseLabel.textContent = sceneStages[current][0];
    status.textContent = statusLabel[st];
    status.className = `scene-status ${st}`;
    fill.style.width = `${((current + 1) / sceneStages.length) * 100}%`;
    steps.forEach((step, i) => step.classList.toggle("playback-current", i === current));
  };
  const finish = () => {
    clearInterval(playbackTimer);
    playbackTimer = null;
    replay?.classList.add("finished");
    showResults(rep, true);
  };
  const advance = () => {
    if (current >= last) return finish();
    current += 1;
    paint();
  };
  const play = () => {
    if (playbackTimer) clearInterval(playbackTimer);
    current = 0;
    replay?.classList.remove("finished");
    showResults(rep, false);
    paint();
    playbackTimer = setInterval(advance, 2600);
  };
  replay?.addEventListener("click", play);
  $("skip-mission")?.addEventListener("click", () => {
    current = last;
    paint();
    finish();
  });
  if (calm) {
    current = last;
    paint();
    finish();
  } else play();
}

function renderTimeline(result) {
  const icon = { success: "✓", warning: "!", failed: "×", blocked: "—" };
  const label = { success: "Nominal", warning: "Degraded", failed: "Failed", blocked: "Blocked" };
  return `<section class="mission-playback">
    <div class="playback-head"><h3>Mission sequence</h3><span class="mission-state ${result.complete ? "good" : "caution"}">${result.complete ? "MISSION SUCCESS" : result.launchOK === false ? "LAUNCH FAILED" : result.launchOK === null ? "LAUNCH UNVERIFIED" : "PARTIAL SUCCESS"}</span></div>
    ${renderMissionScene(result)}
    <div class="playback-controls"><button class="btn btn-replay" id="skip-mission" type="button">Skip to results ▸</button><button class="btn btn-replay" id="replay-mission" type="button">↻ Replay sequence</button></div>
    <ol class="timeline">${result.phases.map((p, i) => `<li class="timeline-step ${p.status}"><div class="timeline-marker">${icon[p.status]}</div><div class="timeline-content"><div class="timeline-top"><b>${i + 1}. ${p.name}</b><span class="timeline-time">${p.time}</span></div><div class="timeline-status ${p.status}">${label[p.status]}</div><p>${p.detail}</p></div></li>`).join("")}</ol>
    ${result.incidents.length ? `<div class="incident-panel"><h3>Issues to resolve</h3><div class="incident-list">${result.incidents.map(([title, fix]) => `<div class="incident"><b>${title}</b><p>${fix}</p></div>`).join("")}</div></div>` : ""}
  </section>`;
}

export function simulate() {
  const c = calc(), checks = [];
  const add = (ok, t) => checks.push(`<div class="chk ${ok ? "ok" : "bad"}">${ok ? "✓" : "✗"} ${t}</div>`);
  if (c.cap == null)
    checks.push(`<div class="chk warn">? Launch: ${c.launchCapacityNote} The ${c.mass.toLocaleString()} kg mass check is unverified.</div>`);
  else
    add(c.mass <= c.cap, c.mass <= c.cap ? `Launch: ${c.mass.toLocaleString()} of ${c.cap.toLocaleString()} kg.` : `Launch failed: ${c.mass.toLocaleString()} kg exceeds the ${c.cap.toLocaleString()} kg limit.`);
  add(c.powUse <= c.gen, c.powUse <= c.gen ? "Power: enough for all systems." : `Power short: need ${c.powUse} W, have ${c.gen} W.`);
  add(c.misfit == 0, c.misfit == 0 ? "Payload: suits the objective." : `Payload: ${c.misfit} instrument(s) don’t suit the objective (30% value).`);
  add(c.data <= c.down, c.data <= c.down ? `Data: all ${c.data} Gb/day returned.` : `Data loss: ${c.data} Gb/day collected, ${c.down} sent.`);
  add(c.k.rel >= 0.99, c.k.rel >= 0.99 ? `Control: ${Number((c.k.rel * 100).toFixed(2))}% reliability.` : `Control: ${Math.round(c.k.rel * 100)}% reliability; response is reduced.`);
  add(c.u.mult >= 1, c.u.mult >= 1 ? `Users: ${c.u.users.replace(" users", "")} reached.` : "Users: limited reach.");
  add(c.orbOK, c.orbOK ? "Orbit suits the objective." : "Orbit doesn’t suit the objective.");
  if (c.orbitAnalysis?.kind === "circular") {
    const periodText = `Kepler period: ${c.orbitAnalysis.periodLabel}; reference: ${c.orbitAnalysis.referencePeriodLabel}.`;
    add(c.orbitAnalysis.consistent !== false, `Orbital mechanics: ${periodText} Circular two-body estimate.`);
  } else {
    checks.push(`<div class="chk warn">? Orbital mechanics: ${c.orbitAnalysis?.note || "A full Kepler estimate is unavailable for the supplied orbital elements."}</div>`);
  }
  add(c.life >= c.months, c.life >= c.months ? `Lifetime: ${c.life} of ${c.months} mo.` : `Lifetime too short: ${c.life} of ${c.months} mo.`);
  add(c.cost <= c.budget, c.cost <= c.budget ? `Budget: $${c.budget - c.cost}M left.` : `Over budget by $${c.cost - c.budget}M.`);
  const rep = buildReport(c);
  const mission = buildTimeline(c);
  $("out").innerHTML =
    `<div class="row"><div><div class="sub">Mission score</div><div class="score mono" id="score-val">…</div></div><div class="sub" id="score-sub">Revealed when the mission ends</div></div>` +
    `<div class="seglist">${Object.values(c.seg).map((v, i) => `<div><b>${names[i]} segment</b><br><span class="mono">$${Math.round(v)}M</span></div>`).join("")}</div>` +
    renderTimeline(mission) +
    `<div class="report" id="mission-report" hidden>${renderReport(rep)}</div>` +
    `<h3 class="subh">Design checks</h3>` + checks.join("");
  startPlayback(mission, rep);
}
