// Rule-based mission timeline. Outcomes are driven by the player's selected design.

const phase = (name, time, status, detail) => ({ name, time, status, detail });

export function buildTimeline(c) {
  const launchOK = c.mass <= c.cap;
  const orbitOK = c.orbOK;
  const powerOK = c.powUse <= c.gen;
  const dataOK = c.data <= c.down;
  const lifeOK = c.life >= c.months;
  const payloadOK = c.misfit === 0;
  const controlOK = c.k.rel >= 1;
  const budgetOK = c.cost <= c.budget;
  const usersOK = c.u.mult >= 1;

  const phases = [];
  phases.push(phase(
    "Launch & separation", "T+0",
    launchOK ? "success" : "failed",
    launchOK
      ? `${c.v.n} can lift ${c.mass.toLocaleString()} kg against a ${c.cap.toLocaleString()} kg payload limit. Spacecraft separation is nominal.`
      : `Launch is scrubbed: the spacecraft is ${ (c.mass - c.cap).toLocaleString() } kg over this vehicle's ${c.cap.toLocaleString()} kg limit.`
  ));

  if (!launchOK) {
    phases.push(phase("Orbit insertion", "T+hours", "blocked", "The spacecraft never reaches orbit because launch was not possible."));
    phases.push(phase("Commissioning", "T+1–7 days", "blocked", "Power, communications, and attitude checks cannot begin in orbit."));
    phases.push(phase("Science operations", "Mission months", "blocked", "No science data can be collected without a deployed spacecraft."));
    phases.push(phase("Downlink & delivery", "Daily", "blocked", "No observations are available to send to ground users."));
  } else {
    phases.push(phase(
      "Orbit insertion", "T+hours",
      orbitOK ? "success" : "warning",
      orbitOK
        ? `${c.orb.n} is compatible with the ${c.o.n.toLowerCase()} objective.`
        : `${c.orb.n} is not on the recommended orbit list for this objective. The spacecraft arrives, but coverage or viewing geometry will reduce science return.`
    ));
    phases.push(phase(
      "Commissioning", "T+1–7 days",
      powerOK ? (controlOK ? "success" : "warning") : "failed",
      powerOK
        ? (controlOK
          ? `Spacecraft power budget closes at ${c.powUse} W used of ${c.gen} W generated. Ground control is staffed for rapid response.`
          : `Power is sufficient (${c.powUse}/${c.gen} W), but reduced control staffing (${Math.round(c.k.rel * 100)}% reliability factor) makes anomaly recovery slower.`)
        : `Commissioning is incomplete: systems request ${c.powUse} W but the selected power system supplies ${c.gen} W. Non-essential loads must be shed.`
    ));
    phases.push(phase(
      "Science operations", `Month 1–${c.months}`,
      powerOK && lifeOK && payloadOK && orbitOK ? "success" : "warning",
      `${c.o.n} operations begin with the selected instrument suite. ${lifeOK ? `Designed life is ${c.life} months for a ${c.months}-month mission.` : `Designed life is only ${c.life} months; the mission needs ${c.months} months.`} ${payloadOK ? "All selected instruments match the objective." : `${c.misfit} instrument(s) are a poor fit, reducing useful science return.`}`
    ));
    phases.push(phase(
      "Downlink & data delivery", "Daily contact windows",
      dataOK ? "success" : "warning",
      dataOK
        ? `The link can return about ${c.down} Gb/day against ${c.data} Gb/day generated. The planned data volume can be delivered.`
        : `The mission generates ${c.data} Gb/day but can return about ${c.down} Gb/day. The backlog grows unless data is compressed, prioritized, or contact time is increased.`
    ));
  }

  const technicalOK = launchOK && orbitOK && powerOK && dataOK && lifeOK && payloadOK && controlOK && usersOK;
  const complete = technicalOK && budgetOK;
  phases.push(phase(
    "Mission review", "End of planned mission",
    complete ? "success" : launchOK ? "warning" : "failed",
    complete
      ? `Mission objectives are supported by the design and the $${c.budget}M budget is respected. Prepare the final science and performance report.`
      : !launchOK
        ? "Mission not achieved: resolve the launch mass shortfall and run the simulation again."
        : `Mission is not fully successful. ${!budgetOK ? `The design exceeds budget by $${Math.round(c.cost - c.budget)}M. ` : ""}${!orbitOK ? "Orbit mismatch reduces science return. " : ""}${!powerOK ? "Power deficit limits operations. " : ""}${!dataOK ? "Some science data cannot be returned. " : ""}${!lifeOK ? "Design life is shorter than the mission. " : ""}${!payloadOK ? "Instrument mismatch reduces science value. " : ""}${!controlOK ? "Low control reliability increases operational risk. " : ""}${!usersOK ? "The user segment limits access to the mission data. " : ""}Revise the design and simulate again.`
  ));

  const incidents = [];
  if (!launchOK) incidents.push(["Launch vehicle overload", `Reduce spacecraft mass by at least ${(c.mass - c.cap).toLocaleString()} kg or select a vehicle with more capacity for ${c.orb.n}.`]);
  if (!orbitOK) incidents.push(["Orbit does not match the science", `Choose an orbit suited to ${c.o.n.toLowerCase()} or change the mission objective.`]);
  if (!powerOK) incidents.push(["Power shortfall", `Free up at least ${c.powUse - c.gen} W by changing the bus, instruments, or communications system, or select a higher-output power system.`]);
  if (!dataOK) incidents.push(["Growing data backlog", `Increase downlink capacity or reduce the instrument data rate by at least ${c.data - c.down} Gb/day.`]);
  if (!lifeOK) incidents.push(["Spacecraft lifetime shortfall", `The design needs ${c.months - c.life} more months of service life.`]);
  if (!payloadOK) incidents.push(["Instrument mismatch", "Replace instruments that do not support the selected science objective."]);
  if (!controlOK) incidents.push(["Slow anomaly response", "Choose a higher-reliability mission-control option to improve recovery from spacecraft faults."]);
  if (!usersOK) incidents.push(["Limited data reach", "Choose a data-access option that can serve the intended science users."]);
  if (!budgetOK) incidents.push(["Budget overrun", `Remove or downgrade components worth at least $${Math.round(c.cost - c.budget)}M.`]);

  return { phases, incidents, complete, launchOK, budgetOK };
}
