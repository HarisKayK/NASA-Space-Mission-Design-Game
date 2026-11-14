// Shared game state and small helpers.
export const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
export const S = {
  obj: 0,
  bus: 2,
  pow: 2,
  com: 1,
  ins: new Set([4]),
  orb: 1,
  veh: 1,
  gnd: 1,
  ctl: 1,
  usr: 1,
  tab: 0,
};
export const TABS = [
  "Mission",
  "Launch",
  "Space",
  "Ground",
  "User",
  "Simulate",
];
export const $ = (id) => document.getElementById(id);
