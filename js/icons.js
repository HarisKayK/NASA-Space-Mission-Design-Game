// Inline SVG illustrations for every card and the mission diagram.
// ICON.<kind>(item, index) picks its picture by the item's position in its JSON list.
import { calm } from "./state.js";

// ---- Illustrations (inline SVG, 120x72 boxes, subtle animation) ----
let uid = 0;
const cid = () => "k" + ++uid;
export const sv = (c) =>
  `<svg class="svg" viewBox="0 0 120 72">${calm ? c.replace(/<animate\w*[^>]*\/>/g, "") : c}</svg>`;
const SAT = `<g><rect x="-2.4" y="-2" width="4.8" height="4" rx=".8" fill="url(#gG)"/><rect x="-8.5" y="-1.2" width="5.5" height="2.4" fill="url(#cells)" stroke="#5ea1ff" stroke-width=".3"/><rect x="3" y="-1.2" width="5.5" height="2.4" fill="url(#cells)" stroke="#5ea1ff" stroke-width=".3"/></g>`;
const earth = (cx, cy, r) => {
  const id = cid();
  return `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs><circle cx="${cx}" cy="${cy}" r="${r + 2.5}" fill="#5ea1ff" opacity=".22" filter="url(#glow)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gE)"/><g clip-path="url(#${id})" fill="#4ea36a" opacity=".9"><path transform="translate(${cx - r} ${cy - r}) scale(${r / 20})" d="M6 14q4-7 10-4t4 8-7 6-8-3Zm20 8q5-2 7 3t-3 8-6-4Zm-8-22q5-2 8 1t-4 4-5-2Z"><animateTransform attributeName="transform" type="translate" values="${cx - r} ${cy - r};${cx - r + 2} ${cy - r};${cx - r} ${cy - r}" dur="14s" repeatCount="indefinite" additive="replace"/></path></g><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gSh)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#a9d0ff" stroke-opacity=".5" stroke-width=".6"/>`;
};
const moon = (cx, cy, r) =>
  `<circle cx="${cx}" cy="${cy}" r="${r + 2}" fill="#cfd6f0" opacity=".12" filter="url(#glow)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gMo)"/><g fill="#5b6177" opacity=".55"><circle cx="${cx - r * 0.35}" cy="${cy - r * 0.3}" r="${r * 0.22}"/><circle cx="${cx + r * 0.3}" cy="${cy + r * 0.25}" r="${r * 0.3}"/><circle cx="${cx - r * 0.1}" cy="${cy + r * 0.55}" r="${r * 0.13}"/><circle cx="${cx + r * 0.5}" cy="${cy - r * 0.45}" r="${r * 0.12}"/></g><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#gSh)"/>`;
const orbit = (rx, ry, rot, dur, dash) =>
  `<g transform="rotate(${rot} 60 36)"><ellipse cx="60" cy="36" rx="${rx}" ry="${ry}" fill="none" stroke="#8fb0ff" stroke-opacity=".55" stroke-width=".7" stroke-dasharray="${dash || "1.5 3"}"/><g><animateMotion dur="${dur}s" repeatCount="indefinite" path="M${60 + rx} 36a${rx} ${ry} 0 1 1 ${-2 * rx} 0a${rx} ${ry} 0 1 1 ${2 * rx} 0"/>${SAT}</g></g>`;
const R = (cx, w, h) => {
  const base = 60,
    top = base - h,
    ny = top + w * 1.7,
    bh = base - ny;
  return `<g class="fl8"><path class="flame" d="M${cx - w * 0.32} ${base + 3}Q${cx} ${base + 19} ${cx + w * 0.32} ${base + 3}Z" fill="url(#gF)"/><path d="M${cx - w / 2} ${base - w * 1.7}l-${w * 0.6} ${w * 1.7}h${w * 0.6}Zm${w} 0l${w * 0.6} ${w * 1.7}h-${w * 0.6}Z" fill="#56689a"/><path d="M${cx - w / 2} ${ny}Q${cx - w / 2} ${top + w * 0.55} ${cx} ${top}Q${cx + w / 2} ${top + w * 0.55} ${cx + w / 2} ${ny}Z" fill="url(#gW)" stroke="#7b8db8" stroke-width=".6"/><rect x="${cx - w / 2}" y="${ny}" width="${w}" height="${bh}" fill="url(#gW)" stroke="#7b8db8" stroke-width=".6"/><rect x="${cx - w / 2}" y="${ny + bh * 0.2}" width="${w}" height="${bh * 0.07}" fill="#2a3f7a"/><rect x="${cx - w / 2}" y="${ny + bh * 0.55}" width="${w}" height="${bh * 0.04}" fill="#2a3f7a"/><circle cx="${cx}" cy="${ny + 3.5}" r="${w * 0.17}" fill="#16336b" stroke="#9fb4e8" stroke-width=".4"/><path d="M${cx - w * 0.3} ${base}h${w * 0.6}l${w * 0.15} 3h-${w * 0.9}Z" fill="#46517a"/></g>`;
};
const pad = `<path d="M6 66h108" stroke="#33436e" stroke-width="1"/><path d="M20 66v-6h4v6M96 66v-6h4v6" stroke="#46517a" stroke-width="1" fill="none"/>`;
const busBox = (w, h) => {
  const x = 60 - w / 2,
    y = 36 - h / 2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#gG)" stroke="#a07a20" stroke-width=".8"/><path d="M${x + 3} ${y + h * 0.45}l${w / 4} 3 ${w / 4}-3 ${w / 4} 3" fill="none" stroke="#b98a22" stroke-width=".5"/><rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="5" rx="1" fill="#16336b" stroke="#5ea1ff" stroke-width=".4"/><circle cx="60" cy="${y - 4}" r="3" fill="url(#gM)" stroke="#7b8db8" stroke-width=".5"/><path d="M60 ${y - 1}v1" stroke="#7b8db8"/><path d="M${60 - w / 3} ${y + h}l-1.8 3.5h3.6ZM${60 + w / 3} ${y + h}l-1.8 3.5h3.6Z" fill="#46517a"/>`;
};
const panels = (n, pw, ph, box) => {
  let o = `<path d="M10 36H110" stroke="#7b8db8" stroke-width="1"/>`;
  for (let k = 0; k < n; k++) {
    const xl = 60 - 8 - (k + 1) * (pw + 1.5),
      xr = 60 + 8 + k * (pw + 1.5) + 1.5;
    for (const x of [xl, xr])
      o += `<rect x="${x}" y="${36 - ph / 2}" width="${pw}" height="${ph}" fill="url(#cells)" stroke="#5ea1ff" stroke-width=".6"/><rect class="gl" style="animation-delay:${k * 0.7}s" x="${x}" y="${36 - ph / 2}" width="${pw}" height="${ph}" fill="url(#gGl)"/>`;
  }
  return (
    o +
    (box
      ? `<rect x="52" y="28" width="16" height="16" rx="2" fill="url(#gG)" stroke="#a07a20" stroke-width=".7"/>`
      : "")
  );
};
const waves = (cx, cy) =>
  [0, 1, 2]
    .map(
      (k) =>
        `<g class="wv" style="animation-delay:${k * 0.7}s"><path d="M${cx - 4 - k * 3} ${cy}q${4 + k * 3}-${4 + k * 2} ${8 + k * 6} 0" fill="none" stroke="#8fb0ff" stroke-width="1" stroke-linecap="round"/></g>`,
    )
    .join("");
const dishG = (cx, cy, r, wv = 1) =>
  `<path d="M${cx - 3} ${cy + 17}l1.5-13h3l1.5 13Z" fill="url(#gM)" stroke="#7b8db8" stroke-width=".5"/><g class="sway"><path d="M${cx - r} ${cy - r * 0.3}Q${cx} ${cy + r * 0.95} ${cx + r} ${cy - r * 0.3}Z" fill="url(#gM)" stroke="#7b8db8" stroke-width=".6"/><ellipse cx="${cx}" cy="${cy - r * 0.3}" rx="${r}" ry="${r * 0.2}" fill="#dfe6fa" stroke="#7b8db8" stroke-width=".5"/><path d="M${cx} ${cy - r * 0.3}V${cy - r * 1.05}" stroke="#9fb4e8" stroke-width=".8"/><circle cx="${cx}" cy="${cy - r * 1.1}" r="1.7" fill="#a78bfa"/></g>${wv ? waves(cx, cy - r * 1.5) : ""}`;
const hill = `<path d="M0 72Q60 58 120 72Z" fill="#14234a"/>`;
const avatar = (cx, cy, sc, col, d) =>
  `<g class="pl" style="animation-delay:${d}s"><circle cx="${cx}" cy="${cy - 4 * sc}" r="${2.6 * sc}" fill="${col}"/><path d="M${cx - 4.2 * sc} ${cy + 3.5 * sc}q0-${6 * sc} ${4.2 * sc}-${6 * sc}t${4.2 * sc} ${6 * sc}Z" fill="${col}"/></g>`;
const mon = (x, y, w, h, d) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="1.5" fill="url(#gSc)" stroke="#5ea1ff" stroke-width=".7"/><path class="ln" style="animation-delay:${d}s" d="M${x + 3} ${y + h * 0.7}l${w * 0.15}-${h * 0.3} ${w * 0.15} ${h * 0.15} ${w * 0.2}-${h * 0.35} ${w * 0.15} ${h * 0.25} ${w * 0.2}-${h * 0.2}" fill="none" stroke="#4cd18a" stroke-width="1" stroke-dasharray="40" stroke-linecap="round"/><path d="M${x + w / 2} ${y + h}v3M${x + w / 2 - 4} ${y + h + 3}h8" stroke="#7b8db8" stroke-width=".8"/>`;
const clock = (cx, cy) =>
  `<circle cx="${cx}" cy="${cy}" r="6" fill="#0d1a3c" stroke="#a78bfa" stroke-width=".8"/><path d="M${cx} ${cy}V${cy - 4}" stroke="#e6ebff" stroke-width=".8"><animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="12s" repeatCount="indefinite"/></path><path d="M${cx} ${cy}l2.5 1.5" stroke="#8d99c0" stroke-width=".8"/>`;
const SUNI =
  `<circle cx="60" cy="36" r="24" fill="#ffb020" opacity=".18" filter="url(#glow)"/><circle cx="60" cy="36" r="13" fill="url(#gSun)"/><circle class="dsh" cx="60" cy="36" r="19" fill="none" stroke="#ffcf6b" stroke-opacity=".6" stroke-dasharray="2 3"/>` +
  orbit(50, 10, -15, 9);
const CORI = `<circle cx="60" cy="36" r="22" fill="#ffb020" opacity=".25" filter="url(#glow)"/><circle cx="60" cy="36" r="12" fill="#0b1a3a" stroke="#ffcf6b" stroke-width="1.2"/><path class="dsh" d="M60 8v10M60 54v10M32 36h10M78 36h10" stroke="#ffcf6b" stroke-width="1.4" stroke-dasharray="3 4"/>`;
export const ICON = {
  obj: (o, i) =>
    [
      earth(60, 36, 24) + orbit(34, 11, -20, 10),
      moon(60, 36, 24) + orbit(34, 11, -20, 10),
      (() => {
        const id = cid();
        return (
          earth(60, 36, 24) +
          `<defs><clipPath id="${id}"><circle cx="60" cy="36" r="24"/></clipPath></defs><g clip-path="url(#${id})"><path d="M52 32m0 0a3 3 0 1 1 6 0a8 8 0 1 1-14 0a13 13 0 1 1 22 0" transform="translate(4 4)" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2.4" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 58 38" to="360 58 38" dur="18s" repeatCount="indefinite"/></path></g><circle cx="100" cy="14" r="7" fill="url(#gSun)" filter="url(#glow)"/>`
        );
      })(),
      SUNI,
    ][i],
  orb: (o) =>
    ({
      leo: earth(60, 36, 14) + orbit(26, 10, -18, 5),
      sso: earth(60, 36, 14) + orbit(9, 31, 14, 7),
      geo: earth(60, 36, 8) + orbit(52, 18, -8, 18, "3 3"),
      moon: moon(60, 36, 14) + orbit(28, 10, -14, 9),
    })[o.id],
  veh: (v, i) =>
    pad +
    [
      R(60, 7, 36),
      R(60, 9, 48),
      R(60, 9, 54),
      R(46, 6, 38) + R(74, 6, 38) + R(60, 9, 54),
    ][i],
  bus: (b, i) => busBox([24, 32, 36, 46][i], [20, 28, 30, 38][i]),
  pow: (p, i, box) =>
    panels(
      [1, 1, 2, 3][i],
      [14, 14, 12, 11][i],
      [16, 24, 28, 34][i],
      box !== false,
    ),
  com: (c, i) =>
    i == 0
      ? `<path d="M60 64V22" stroke="#9fb4e8" stroke-width="1.4"/><circle cx="60" cy="19" r="3.2" fill="#a78bfa"/>` +
        waves(60, 12) +
        `<rect x="50" y="62" width="20" height="6" rx="1.5" fill="url(#gG)"/>`
      : i == 1
        ? hill + dishG(60, 42, 17)
        : hill +
          dishG(60, 44, 22) +
          `<circle cx="52" cy="20" r="1.5" fill="#a78bfa"/><circle cx="68" cy="20" r="1.5" fill="#a78bfa"/>`,
  ins: (n, i) =>
    [
      [14, 28, 42]
        .map(
          (y, k) =>
            `<rect x="36" y="${y}" width="48" height="7" rx="1.5" fill="url(#gB)" stroke="#9fc2ff" stroke-width=".6"/>`,
        )
        .join("") +
        `<path d="M36 22h48M36 36h48" stroke="#5ea1ff" stroke-dasharray="1 2" opacity=".6"/><path class="dsh" d="M26 4l22 64M60 2l8 66M98 6L82 68" stroke="#ffd27a" stroke-width="1.3" stroke-dasharray="4 8" fill="none" stroke-linecap="round"/>`,
      `<rect x="28" y="16" width="64" height="26" rx="13" fill="url(#gM)" stroke="#7b8db8" stroke-width=".7"/><circle cx="82" cy="29" r="9" fill="url(#gHeat)" stroke="#ffb27a" stroke-width=".7"/><path class="dsh" d="M18 52q6-6 12 0t12 0t12 0t12 0t12 0t12 0" stroke="#ff8a5c" stroke-width="1.3" fill="none" stroke-dasharray="6 5" stroke-linecap="round"/><path class="dsh" d="M18 61q6-6 12 0t12 0t12 0t12 0t12 0t12 0" stroke="#ffb27a" stroke-width="1" fill="none" stroke-dasharray="4 6" stroke-linecap="round" opacity=".7"/>`,
      `<rect x="42" y="6" width="36" height="18" rx="3" fill="url(#gM)" stroke="#7b8db8" stroke-width=".7"/><circle cx="60" cy="24" r="5" fill="#2a1a1a" stroke="#ff6b6b" stroke-width=".8"/><circle cx="60" cy="24" r="2" fill="#ff6b6b" class="pl"/><path class="dsh" d="M60 29V62M54 29L36 62M66 29L84 62" stroke="#ff6b6b" stroke-width="1" stroke-dasharray="3 4" fill="none"/><path d="M8 64l14-4 14 5 18-6 12 4 14-5 14 5 14-3" stroke="#8fb0ff" stroke-width="1" fill="none"/>`,
      `<rect x="18" y="22" width="42" height="30" rx="4" fill="url(#gM)" stroke="#7b8db8" stroke-width=".7"/><rect x="60" y="27" width="26" height="20" rx="3" fill="#33436e" stroke="#7b8db8" stroke-width=".7"/><circle cx="92" cy="37" r="11" fill="url(#gB)" stroke="#9fc2ff" stroke-width=".8"/><circle cx="92" cy="37" r="5" fill="#0b1a3a"/><circle cx="89" cy="34" r="2" fill="#fff" opacity=".7"/><rect x="24" y="15" width="12" height="7" rx="1.5" fill="url(#gM)" stroke="#7b8db8" stroke-width=".5"/><circle class="fs" cx="30" cy="12" r="2" fill="#ffd166"/>`,
      `<rect x="12" y="16" width="78" height="36" rx="5" fill="url(#gM)" stroke="#7b8db8" stroke-width=".7"/><ellipse cx="94" cy="34" rx="8" ry="15" fill="#0b1a3a" stroke="#9fb4e8" stroke-width=".8"/><g><rect x="22" y="22" width="5" height="24" fill="#4aa8ff"/><rect x="31" y="22" width="5" height="24" fill="#4cd18a"/><rect x="40" y="22" width="5" height="24" fill="#ffd166"/><rect x="49" y="22" width="5" height="24" fill="#ff6b6b"/></g><rect class="scn" x="14" y="18" width="2" height="32" fill="#fff" opacity=".8"/><path d="M96 50l14 18M96 18l14-16" stroke="#8fb0ff" stroke-dasharray="2 3" opacity=".6"/>`,
      `<rect x="34" y="4" width="52" height="22" rx="4" fill="url(#gM)" stroke="#7b8db8" stroke-width=".7"/><circle cx="60" cy="15" r="7" fill="url(#gB)" stroke="#9fc2ff" stroke-width=".7"/>` +
        earth(60, 52, 17) +
        `<rect class="scn2" x="43" y="33" width="34" height="1.4" fill="#ffd166" opacity=".9"/>`,
      `<circle cx="60" cy="34" r="22" fill="#ffb020" opacity=".15" filter="url(#glow)"/><g><animateTransform attributeName="transform" type="rotate" from="0 60 34" to="360 60 34" dur="30s" repeatCount="indefinite"/>${[
        0, 1, 2, 3, 4, 5, 6, 7,
      ]
        .map((k) => {
          const a = (k * Math.PI) / 4;
          return `<path d="M${60 + 14 * Math.cos(a)} ${34 + 14 * Math.sin(a)}L${60 + 22 * Math.cos(a)} ${34 + 22 * Math.sin(a)}" stroke="#ffcf6b" stroke-width="1.6" stroke-linecap="round"/>`;
        })
        .join(
          "",
        )}</g><circle cx="60" cy="34" r="11" fill="url(#gSun)"/><rect x="86" y="46" width="24" height="16" rx="2" fill="url(#gM)" stroke="#7b8db8" stroke-width=".6"/><circle cx="98" cy="54" r="4" fill="#0b1a3a" stroke="#ffcf6b" stroke-width=".6"/>`,
      CORI,
    ][i],
  gnd: (g, i) =>
    hill +
    [
      dishG(60, 44, 16),
      dishG(26, 48, 10) +
        dishG(60, 44, 14) +
        dishG(94, 48, 10) +
        `<rect x="102" y="56" width="10" height="7" fill="#33436e"/>`,
      dishG(60, 50, 12, 0) +
        `<g><animateMotion dur="9s" repeatCount="indefinite" path="M12 14Q60 -6 108 14"/>${SAT}</g><g><animateMotion dur="9s" begin="-4.5s" repeatCount="indefinite" path="M108 14Q60 -6 12 14"/>${SAT}</g><path class="dsh" d="M60 36L30 12M60 36L90 12" stroke="#8fb0ff" stroke-width=".8" stroke-dasharray="2 3" fill="none"/>`,
    ][i],
  ctl: (k, i) =>
    `<rect x="4" y="6" width="112" height="60" rx="4" fill="#0b1633"/><path d="M4 56h112v10H4Z" fill="#14234a"/>` +
    (i == 0
      ? mon(36, 14, 48, 28, 0) +
        avatar(36, 54, 1.5, "#5ea1ff", 0) +
        clock(100, 16)
      : mon(8, 16, 30, 18, 0) +
        mon(45, 12, 30, 20, 0.5) +
        mon(82, 16, 30, 18, 1) +
        avatar(30, 56, 1.4, "#5ea1ff", 0) +
        avatar(90, 56, 1.4, "#a78bfa", 0.6) +
        clock(60, 50)),
  usr: (u, i) =>
    i == 0
      ? [0, 1, 2]
          .map((k) =>
            avatar(
              32 + k * 28,
              44,
              2.4,
              ["#5ea1ff", "#a78bfa", "#4cd18a"][k],
              k * 0.5,
            ),
          )
          .join("")
      : i == 1
        ? `<ellipse cx="26" cy="20" rx="14" ry="5" fill="url(#gB)" stroke="#9fc2ff" stroke-width=".6"/><path d="M12 20v26c0 6 28 6 28 0V20" fill="url(#gB)" stroke="#9fc2ff" stroke-width=".6"/><path d="M12 33c0 6 28 6 28 0" fill="none" stroke="#9fc2ff" stroke-width=".5"/>` +
          Array.from({ length: 8 }, (_, k) =>
            avatar(
              62 + (k % 4) * 14,
              26 + Math.floor(k / 4) * 22,
              1.6,
              k % 2 ? "#a78bfa" : "#5ea1ff",
              k * 0.3,
            ),
          ).join("")
        : `<circle cx="30" cy="36" r="22" fill="url(#gE)" stroke="#9fc2ff" stroke-width=".6"/><path d="M8 36h44M30 14c-10 10-10 34 0 44M30 14c10 10 10 34 0 44" stroke="#9fc2ff" stroke-width=".5" fill="none"/><path class="dsh" d="M44 30L66 18M46 38L70 38M44 44L66 56" stroke="#8fb0ff" stroke-width=".8" stroke-dasharray="2 3" fill="none"/>` +
          Array.from({ length: 12 }, (_, k) =>
            avatar(
              72 + (k % 4) * 12,
              16 + Math.floor(k / 4) * 18,
              1.3,
              ["#5ea1ff", "#a78bfa", "#4cd18a"][k % 3],
              k * 0.2,
            ),
          ).join(""),
  seg: (i) =>
    [
      pad + R(60, 9, 50),
      panels(1, 14, 22, false) + busBox(30, 26),
      hill + dishG(60, 44, 16),
      [0, 1, 2]
        .map((k) =>
          avatar(
            32 + k * 28,
            44,
            2.4,
            ["#5ea1ff", "#a78bfa", "#4cd18a"][k],
            k * 0.5,
          ),
        )
        .join(""),
    ][i],
};
