// Option cards: one clickable card per choice in a grid.
import { $ } from "../state.js";
import { ICON, sv } from "../icons.js";

// grid element id -> data kind
export const KIND = {
  "g-obj": "obj",
  "g-orb": "orb",
  "g-veh": "veh",
  "g-bus": "bus",
  "g-pow": "pow",
  "g-com": "com",
  "g-ins": "ins",
  "g-gnd": "gnd",
  "g-ctl": "ctl",
  "g-usr": "usr",
};

// main.js tells the cards which function redraws the page after a pick
let rerender = () => {};
export const onPick = (fn) => (rerender = fn);

export function opt(item, sel, fn, tags, off, svg) {
  const b = document.createElement("button");
  b.title = item.tip || "";
  b.className = "opt" + (sel ? " sel" : "") + (off ? " off" : "");
  b.innerHTML = `${svg ? `<div class="ico">${svg}</div>` : ""}<h3>${item.n}</h3>${item.d ? `<p>${item.d}</p>` : ""}<div class="tags mono">${tags.map((t) => `<span>${t}</span>`).join("")}</div>`;
  b.onclick = fn;
  return b;
}
export function fill(id, arr, isSel, fn, tagf, offf) {
  const g = $(id);
  g.innerHTML = "";
  const k = KIND[id],
    showD = k == "obj" || k == "orb";
  arr.forEach((x, i) =>
    g.appendChild(
      opt(
        {
          n: x.n,
          d: showD ? x.d : "",
          tip: "",
        },
        isSel(i),
        () => {
          fn(i);
          rerender();
        },
        tagf(x),
        offf && offf(x),
        k ? sv(ICON[k](x, i)) : "",
      ),
    ),
  );
}
