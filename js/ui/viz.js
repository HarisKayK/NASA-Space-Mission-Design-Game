// The live mission diagram at the top of the page.
import { S, calm } from "../state.js";
import { ORB, VEH } from "../data.js";
import { ICON } from "../icons.js";

// Live mission diagram: launch > orbit > spacecraft > ground > users
export function viz() {
  const o = ORB[S.orb],
    n = S.ins.size,
    slots = [
      [
        "Launch · " + VEH[S.veh].n.replace(/^(ULA|SpaceX|Rocket Lab) /, ""),
        ICON.veh(0, S.veh),
      ],
      [
        ["Low Earth", "Sun-sync.", "Geostationary", "Lunar"][S.orb] + " orbit",
        ICON.orb(o),
      ],
      [
        "Spacecraft · " + n + " instr.",
        ICON.pow(0, S.pow, false) + ICON.bus(0, S.bus),
      ],
      [
        "Ground · " + ["1 station", "network", "relay"][S.gnd],
        ICON.gnd(0, S.gnd),
      ],
      ["Users · " + ["~100", "1,000s", "millions"][S.usr], ICON.usr(0, S.usr)],
    ];
  return (
    `<div class="vizwrap"><svg class="svg viz" viewBox="0 0 640 100">` +
    [0, 1, 2, 3]
      .map(
        (i) =>
          `<path class="flowln" d="M${i * 128 + 112} 36H${i * 128 + 140}" stroke="#8fb0ff" stroke-width="1.2" stroke-dasharray="3 4" fill="none"/>`,
      )
      .join("") +
    slots
      .map(
        (t, i) =>
          `<g transform="translate(${i * 128 + 4} 0)">${calm ? t[1].replace(/<animate\w*[^>]*\/>/g, "") : t[1]}<text x="60" y="88" text-anchor="middle">${t[0]}</text></g>`,
      )
      .join("") +
    `</svg></div>`
  );
}
