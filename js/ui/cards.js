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
  const photoClass = item.photoClass || "mission-photo";
  const artwork = item.image
    ? `<div class="${photoClass}"><img src="${item.image}" alt="${item.imageAlt || item.n}" loading="lazy" decoding="async"${item.imagePos ? ` style="object-position:${item.imagePos}"` : ""}></div>`
    : svg
      ? `<div class="ico">${svg}</div>`
      : "";
  const body = `${item.kicker ? `<div class="kicker">${item.kicker}</div>` : ""}<h3>${item.n}</h3>${item.d ? `<p>${item.d}</p>` : ""}<div class="tags mono${tags.some(Array.isArray) ? " specs" : ""}">${tags.map((t) => (Array.isArray(t) ? `<span><i class="tl">${t[0]}</i> ${t[1]}</span>` : `<span>${t}</span>`)).join("")}</div>`;
  // Side-by-side cards (e.g. launch vehicles) keep their text in one column.
  b.innerHTML = item.image && photoClass === "vehicle-photo"
    ? `${artwork}<div class="opt-body">${body}</div>`
    : `${artwork}${body}`;
  if (item.image && photoClass === "vehicle-photo") b.classList.add("vehicle-choice");
  b.onclick = fn;
  return b;
}
// artf(item) may return { src, alt, pos, photoClass } to show a photo instead of the SVG icon.
export function fill(id, arr, isSel, fn, tagf, offf, artf) {
  const g = $(id);
  g.innerHTML = "";
  const k = KIND[id],
    showD = true;
  arr.forEach((x, i) => {
    const art = artf && artf(x);
    g.appendChild(
      opt(
        {
          n: x.n,
          d: showD ? x.d : "",
          tip: "",
          image: art?.src,
          imageAlt: art?.alt,
          imagePos: art?.pos,
          photoClass: art?.photoClass,
        },
        isSel(i),
        () => {
          fn(i);
          rerender();
        },
        tagf(x),
        offf && offf(x),
        k && !art ? sv(ICON[k](x, i)) : "",
      ),
    );
  });
}
