// Loads the application catalogues in /data and shares them with other modules. reference-data.json is retained as provenance.
// The exports are live bindings: they are filled in once loadData() finishes.
export let OBJ,
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
  LISTS;

const FILES = {
  OBJ: "objectives",
  ORB: "orbits",
  VEH: "vehicles",
  BUS: "buses",
  POW: "power",
  COM: "comms",
  INS: "instruments",
  GND: "ground",
  CTL: "control",
  USR: "users",
};

const load = (name) =>
  fetch(`data/${name}.json`).then((r) => {
    if (!r.ok) throw new Error(`data/${name}.json: HTTP ${r.status}`);
    return r.json();
  });

export async function loadData() {
  const keys = Object.keys(FILES);
  const vals = await Promise.all(keys.map((k) => load(FILES[k])));
  const d = Object.fromEntries(keys.map((k, i) => [k, vals[i]]));
  ({ OBJ, ORB, VEH, BUS, POW, COM, INS, GND, CTL, USR } = d);
  // objective id -> orbit ids that suit it
  MAP = Object.fromEntries(OBJ.map((o) => [o.id, o.orbits]));
  // grid kind -> list, used by the cards and the info panel
  LISTS = {
    obj: OBJ,
    orb: ORB,
    veh: VEH,
    bus: BUS,
    pow: POW,
    com: COM,
    ins: INS,
    gnd: GND,
    ctl: CTL,
    usr: USR,
  };
}
