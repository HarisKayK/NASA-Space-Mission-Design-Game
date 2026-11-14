// Runs the design checks, calculates the score, and plays out a design-dependent mission timeline.
import { $ } from "../state.js";
import { calc } from "../calc.js";
import { buildTimeline } from "./timeline.js";

const names = ["Launch", "Space", "Ground", "User"];
let playbackTimer = null;

function renderMissionScene(result) {
  return `<div class="mission-scene stage-0 ${result.launchOK ? "" : "launch-failed"}" id="mission-scene" aria-label="Animated illustration of the mission progressing from launch to data delivery">
    <div class="scene-topline"><span>MISSION VISUALIZATION</span><span id="scene-phase">01 / 06 · LAUNCH</span></div>
    <svg class="mission-art" viewBox="0 0 760 260" role="img" aria-hidden="true">
      <defs><radialGradient id="earthGlow"><stop stop-color="#4f8cff" stop-opacity=".42"/><stop offset="1" stop-color="#4f8cff" stop-opacity="0"/></radialGradient><linearGradient id="earthFill" x2="0" y2="1"><stop stop-color="#3e8fe8"/><stop offset="1" stop-color="#142d65"/></linearGradient></defs>
      <circle cx="390" cy="315" r="190" fill="url(#earthGlow)"/><circle cx="390" cy="315" r="150" fill="url(#earthFill)"/><path d="M252 278 Q300 240 340 266 T425 266 T525 290" fill="none" stroke="#7bd6ff" stroke-opacity=".5" stroke-width="3"/>
      <ellipse class="orbit-track" cx="390" cy="175" rx="270" ry="82" fill="none" stroke="#8ca8ff" stroke-opacity=".38" stroke-dasharray="5 8"/>
      <g class="rocket-object"><path d="M145 205 L158 166 Q174 139 190 166 L203 205 L190 198 L178 218 L166 198Z" fill="#e8efff"/><path d="M174 143 Q181 130 188 143 L188 169 L174 169Z" fill="#ffb86b"/><circle cx="181" cy="174" r="5" fill="#72d7ff"/><path class="rocket-flame" d="M170 204 Q181 245 192 204Z" fill="#ff9b55"/></g>
      <g class="satellite-object"><rect x="365" y="92" width="48" height="26" rx="5" fill="#d8e3ff"/><rect x="309" y="96" width="49" height="18" fill="#477bd1" stroke="#9bc4ff"/><path d="M309 96v18m12-18v18m12-18v18m12-18v18m12-18v18" stroke="#9bc4ff" stroke-opacity=".7"/><rect x="420" y="96" width="49" height="18" fill="#477bd1" stroke="#9bc4ff"/><path d="M420 96v18m12-18v18m12-18v18m12-18v18m12-18v18" stroke="#9bc4ff" stroke-opacity=".7"/><path d="M389 92V76l-8-8m8 8 8-8" stroke="#e8efff" stroke-width="3" fill="none"/><circle cx="389" cy="105" r="5" fill="#ffcf7d"/></g>
      <g class="ground-object"><path d="M624 216v-48m-12 48h24m-18-34 6-10 6 10" stroke="#b8c8ff" stroke-width="4" fill="none"/><path d="M604 168q20-23 40 0" stroke="#75d8ff" stroke-width="2" fill="none"/><path d="M594 152q30-34 60 0" stroke="#75d8ff" stroke-opacity=".45" stroke-width="2" fill="none"/></g>
      <path class="data-beam" d="M465 111 Q550 90 624 170" fill="none" stroke="#68e0c0" stroke-width="3" stroke-dasharray="7 7"/>
      <g class="scene-stars" fill="#dce7ff"><circle cx="90" cy="55" r="2"/><circle cx="240" cy="35" r="1.5"/><circle cx="550" cy="52" r="2"/><circle cx="680" cy="92" r="1.5"/><circle cx="720" cy="35" r="2"/><circle cx="290" cy="145" r="1.5"/></g>
    </svg>
    <div class="scene-caption" id="scene-caption">Vehicle ignition · ascent and stage separation</div>
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

function startPlayback(result) {
  if (playbackTimer) clearInterval(playbackTimer);
  const scene = document.getElementById("mission-scene");
  const steps = [...document.querySelectorAll(".timeline-step")];
  const phaseLabel = document.getElementById("scene-phase");
  const caption = document.getElementById("scene-caption");
  const fill = document.getElementById("scene-progress-fill");
  const replay = document.getElementById("replay-mission");
  if (!scene || !steps.length) return;
  let current = 0;
  const paint = () => {
    scene.className = `mission-scene stage-${current}${result.launchOK ? "" : " launch-failed"}`;
    phaseLabel.textContent = sceneStages[current][0];
    caption.textContent = sceneStages[current][1];
    fill.style.width = `${((current + 1) / sceneStages.length) * 100}%`;
    steps.forEach((step, i) => step.classList.toggle("playback-current", i === current));
  };
  const advance = () => {
    if (current >= sceneStages.length - 1) {
      clearInterval(playbackTimer); playbackTimer = null;
      replay?.classList.add("finished");
      return;
    }
    current += 1; paint();
  };
  replay?.addEventListener("click", () => {
    if (playbackTimer) clearInterval(playbackTimer);
    current = 0; replay.classList.remove("finished"); paint();
    playbackTimer = setInterval(advance, 2600);
  });
  paint();
  playbackTimer = setInterval(advance, 2600);
}

function renderTimeline(result) {
  const icon = { success: "✓", warning: "!", failed: "×", blocked: "—" };
  const label = { success: "Nominal", warning: "Degraded", failed: "Failed", blocked: "Blocked" };
  return `<section class="mission-playback">
    <div class="playback-head"><div><div class="sub">Mission playback</div><h3>What happens after you press launch?</h3></div><span class="mission-state ${result.complete ? "good" : "caution"}">${result.complete ? "MISSION SUCCESS" : result.launchOK ? "PARTIAL SUCCESS" : "LAUNCH FAILED"}</span></div>
    <p class="playback-intro">Watch a visual mission walkthrough. The scene is illustrative; phase outcomes are calculated from your selected design, not from high-fidelity orbital or thermal physics.</p>
    ${renderMissionScene(result)}
    <div class="playback-controls"><span class="playback-hint">Auto-playing mission sequence</span><button class="btn btn-replay" id="replay-mission" type="button">↻ Replay sequence</button></div>
    <ol class="timeline">${result.phases.map((p, i) => `<li class="timeline-step ${p.status}"><div class="timeline-marker">${icon[p.status]}</div><div class="timeline-content"><div class="timeline-top"><b>${i + 1}. ${p.name}</b><span class="timeline-time">${p.time}</span></div><div class="timeline-status ${p.status}">${label[p.status]}</div><p>${p.detail}</p></div></li>`).join("")}</ol>
    ${result.incidents.length ? `<div class="incident-panel"><h3>Issues to resolve</h3><div class="incident-list">${result.incidents.map(([title, fix]) => `<div class="incident"><b>${title}</b><p>${fix}</p></div>`).join("")}</div></div>` : `<div class="success-note">All modeled checks pass. Your next step is to review the mission's scientific results and assumptions.</div>`}
  </section>`;
}

export function simulate() {
  const c = calc(), checks = [];
  const add = (ok, t) => checks.push(`<div class="chk ${ok ? "ok" : "bad"}">${ok ? "✓" : "✗"} ${t}</div>`);
  add(c.mass <= c.cap, c.mass <= c.cap ? `Launch: ${c.mass.toLocaleString()} of ${c.cap.toLocaleString()} kg.` : `Launch failed: ${c.mass.toLocaleString()} kg exceeds the ${c.cap.toLocaleString()} kg limit.`);
  add(c.powUse <= c.gen, c.powUse <= c.gen ? "Power: enough for all systems." : `Power short: need ${c.powUse} W, have ${c.gen} W.`);
  add(c.misfit == 0, c.misfit == 0 ? "Payload: suits the objective." : `Payload: ${c.misfit} instrument(s) don’t suit the objective (30% value).`);
  add(c.data <= c.down, c.data <= c.down ? `Data: all ${c.data} Gb/day returned.` : `Data loss: ${c.data} Gb/day collected, ${c.down} sent.`);
  add(c.k.rel >= 1, c.k.rel >= 1 ? "Control: fast fixes." : "Control: part-time team lowers reliability.");
  add(c.u.mult >= 1, c.u.mult >= 1 ? `Users: ${c.u.users.replace(" users", "")} reached.` : "Users: limited reach.");
  add(c.orbOK, c.orbOK ? "Orbit suits the objective." : "Orbit doesn’t suit the objective.");
  add(c.life >= c.months, c.life >= c.months ? `Lifetime: ${c.life} of ${c.months} mo.` : `Lifetime too short: ${c.life} of ${c.months} mo.`);
  add(c.cost <= c.budget, c.cost <= c.budget ? `Budget: $${c.budget - c.cost}M left.` : `Over budget by $${c.cost - c.budget}M.`);
  let s = c.sci * (c.orbOK ? 1 : 0.4) * Math.min(1, c.down / Math.max(c.data, 1)) * Math.min(1, c.life / c.months) * (c.powUse <= c.gen ? 1 : 0.3) * c.k.rel * c.u.mult;
  if (c.mass > c.cap || c.cost > c.budget) s = 0;
  const eff = c.cost <= c.budget ? Math.round(((c.budget - c.cost) / c.budget) * 20) : 0;
  const sci = Math.round(s);
  const mission = buildTimeline(c);
  $("out").innerHTML =
    `<div class="row"><div><div class="sub">Mission score</div><div class="score mono">${sci + eff}</div></div><div class="sub">Science ${sci} + budget efficiency ${eff}</div></div>` +
    `<div class="seglist">${Object.values(c.seg).map((v, i) => `<div><b>${names[i]} segment</b><br><span class="mono">$${Math.round(v)}M</span></div>`).join("")}</div>` +
    renderTimeline(mission) +
    `<h3 class="subh">Build &amp; verify: does the design meet each requirement?</h3>` + checks.join("");
  startPlayback(mission);
}
