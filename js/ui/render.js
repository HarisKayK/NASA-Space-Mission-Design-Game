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
  MAP,
} from "../data.js";
import { calc } from "../calc.js";
import { fill, opt } from "./cards.js";
import { hud } from "./hud.js";

const MISSION_ART = {
  earth: {
    src: "Images/Missions/earth-observation.jpg",
    alt: "Earth viewed from space, showing the curved horizon and land surface",
  },
  moon: {
    src: "Images/Missions/lunar-science-wide.jpg",
    alt: "The Moon viewed from space, with its cratered surface visible",
  },
  weather: {
    src: "Images/Missions/weather-monitoring.jpg",
    alt: "A large weather system over Earth viewed from orbit",
  },
  solar: {
    src: "Images/Missions/solar-science-wide.jpg",
    alt: "A close view of the Sun and its active surface",
  },
};

// Launch vehicle photos, matched by the vehicle's name in data/vehicles.json.
// `pos` keeps the rocket centred when the tall photo is cropped to its frame.
const VEHICLE_ART = {
  "Rocket Lab Electron": {
    src: "Images/Launch_Vehicles/Rocket-lab-electron.jpg",
    alt: "Rocket Lab Electron on its launch pad beside the ocean",
    pos: "51% 50%",
  },
  "ULA Atlas V 401": {
    src: "Images/Launch_Vehicles/ULA-Atlas-V-401.jpg",
    alt: "Atlas V payload fairing carrying Landsat 9, inside the launch facility",
    pos: "54% 40%",
  },
  "SpaceX Falcon 9": {
    src: "Images/Launch_Vehicles/SpaceX-falcon-9.jpg",
    alt: "SpaceX Falcon 9 standing on the launch pad",
    pos: "52% 50%",
  },
  "SpaceX Falcon Heavy": {
    src: "Images/Launch_Vehicles/SpaceX-falcon-heavy.jpg",
    alt: "SpaceX Falcon Heavy with its two side boosters on the launch pad",
    pos: "52% 50%",
  },
};
const vehicleArt = (v) => {
  const a = VEHICLE_ART[v.n];
  return a ? { ...a, photoClass: "vehicle-photo" } : null;
};

// Pairs each spec value with a plain-language label: ["Mass", "100 kg"].
const labelled = (labels, vals) => vals.map((v, i) => [labels[i] || "", v]);

function renderSelectionSummary() {
  const chosen = [
    ["Mission", OBJ[S.obj]?.representativeMission || OBJ[S.obj]?.n],
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
  const missionGrid = $("g-obj");
  missionGrid.innerHTML = "";
  OBJ.forEach((o, i) => {
    const card = opt(
      {
        n: o.representativeMission || o.n,
        kicker: o.n,
        d: o.need,
        image: MISSION_ART[o.id]?.src,
        imageAlt: MISSION_ART[o.id]?.alt,
      },
      i === S.obj,
      () => {
        S.obj = i;
        // A mission selection starts with the first orbit listed as suitable
        // for that mission. The Launch step can still change it afterwards.
        const recommendedOrbit = ORB.findIndex((orbit) =>
          MAP[o.id]?.includes(orbit.id),
        );
        if (recommendedOrbit >= 0) S.orb = recommendedOrbit;
        render();
      },
      labelled(["Budget", "Lifespan", "Orbit"], o.sourceTags || []),
      false,
      "",
    );
    card.classList.add("mission-choice");
    card.classList.add(`mission-choice-${o.id}`);
    card.setAttribute("aria-pressed", String(i === S.obj));
    missionGrid.appendChild(card);
  });
  fill(
    "g-orb",
    ORB,
    (i) => i == S.orb,
    (i) => (S.orb = i),
    (o) => [["Altitude", o.alt], ["Period", o.per]],
  );
  fill(
    "g-veh",
    VEH,
    (i) => i == S.veh,
    (i) => (S.veh = i),
    (o) => {
      const cap = o.cap[ORB[S.orb].id];
      return [
        ["Price", (o.costRange || "$" + o.cost + "M").replace(/ per launch$/, "")],
        [
          "Payload",
          cap == null
            ? o.transferCap?.gto && ORB[S.orb].id === "geo"
              ? "GTO " + o.transferCap.gto.toLocaleString() + " kg · GEO n/a"
              : "not supplied"
            : cap
              ? cap.toLocaleString() + " kg"
              : "not available",
        ],
      ];
    },
    (o) => o.cap[ORB[S.orb].id] === 0,
    vehicleArt,
  );
  fill(
    "g-bus",
    BUS,
    (i) => i == S.bus,
    (i) => (S.bus = i),
    (o) =>
      labelled(
        ["Mass", "Cost", "Power", "Life"],
        o.sourceTags || [o.mass + " kg", "$" + o.cost + "M", o.load + " W", o.life + " mo"],
      ),
  );
  fill(
    "g-pow",
    POW,
    (i) => i == S.pow,
    (i) => (S.pow = i),
    (o) =>
      labelled(
        ["Mass", "Cost", "Output"],
        o.sourceTags || [o.mass + " kg", "$" + o.cost + "M", o.gen + " W"],
      ),
  );
  fill(
    "g-com",
    COM,
    (i) => i == S.com,
    (i) => (S.com = i),
    (o) =>
      labelled(
        ["Mass", "Power", "Data rate", "Cost"],
        o.sourceTags || [o.mass + " kg", o.pow + " W", o.rate + " Mbps", "$" + o.cost + "M"],
      ),
  );
  fill(
    "g-ins",
    INS,
    (i) => S.ins.has(i),
    (i) => (S.ins.has(i) ? S.ins.delete(i) : S.ins.add(i)),
    (o) => [
      ...labelled(
        ["Mass", "Power", "Cost", "Data"],
        o.sourceTags || [o.mass + " kg", o.pow + " W", "$" + o.cost + "M", o.data + " Gb/day"],
      ),
      ["Science", "★" + o.sci],
    ],
  );
  fill(
    "g-gnd",
    GND,
    (i) => i == S.gnd,
    (i) => (S.gnd = i),
    (o) =>
      labelled(
        ["Cost", "Contact"],
        o.sourceTags || ["$" + o.cost + "M", "≈" + o.h + " h/day"],
      ),
  );
  fill(
    "g-ctl",
    CTL,
    (i) => i == S.ctl,
    (i) => (S.ctl = i),
    (o) =>
      labelled(
        ["Cost", "Reliability"],
        (o.sourceTags || ["$" + o.cost + "M", (o.rel * 100).toFixed(o.rel % 1 ? 2 : 0) + "%"]).map(
          (t) => t.replace(/ reliability$/, ""),
        ),
      ),
  );
  fill(
    "g-usr",
    USR,
    (i) => i == S.usr,
    (i) => (S.usr = i),
    (o) => [
      ...labelled(["Cost", "Users"], (o.sourceTags || ["$" + o.cost + "M", o.users]).map((t) => t.replace(/ users$/, ""))),
      ["Score", "×" + o.mult],
    ],
  );
  hud();
  renderSelectionSummary();
}
