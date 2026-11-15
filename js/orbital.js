// Lightweight two-body orbit checks inspired by NASA Mission Visualization's
// Keplerian-orbit tutorial. This module deliberately does not draw or animate orbits.

const TWO_PI = 2 * Math.PI;

function formatDuration(minutes) {
  if (!Number.isFinite(minutes)) return "—";
  if (minutes < 60) return `${minutes.toFixed(1)} min`;
  const totalMinutes = Math.round(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const remainder = totalMinutes % 60;
  return remainder ? `${hours} h ${remainder} min` : `${hours} h`;
}

const fmt = (n, digits = 0) => Number(n).toLocaleString("en-US", {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
});

export function analyzeOrbit(orbit, bodies) {
  const mechanics = orbit?.mechanics;
  if (!mechanics) {
    return { kind: "unavailable", message: "No orbital mechanics metadata is available for this orbit." };
  }

  const body = bodies?.[mechanics.centralBody];
  if (!body) {
    return { kind: "unavailable", message: "Central-body constants are not available." };
  }

  if (mechanics.model === "circular-approximation") {
    const altitudeKm = Number(mechanics.altitudeKm);
    if (!Number.isFinite(altitudeKm) || !Number.isFinite(body.radiusKm) || !Number.isFinite(body.muKm3s2)) {
      return { kind: "unavailable", message: "The altitude or central-body constants needed for this estimate are missing." };
    }

    // For the intentionally simplified circular reference, a = r = body radius + altitude.
    const semiMajorAxisKm = body.radiusKm + altitudeKm;
    const periodMin = (TWO_PI * Math.sqrt((semiMajorAxisKm ** 3) / body.muKm3s2)) / 60;
    const circularSpeedKmS = Math.sqrt(body.muKm3s2 / semiMajorAxisKm);
    const referencePeriodMin = Number(mechanics.referencePeriodMin);
    const deltaPercent = Number.isFinite(referencePeriodMin) && referencePeriodMin > 0
      ? (Math.abs(periodMin - referencePeriodMin) / referencePeriodMin) * 100
      : null;

    return {
      kind: "circular",
      centralBody: body.name,
      radiusKm: body.radiusKm,
      radiusType: body.radiusType,
      altitudeKm,
      semiMajorAxisKm,
      eccentricity: 0,
      periodMin,
      periodLabel: formatDuration(periodMin),
      referencePeriodMin: Number.isFinite(referencePeriodMin) ? referencePeriodMin : null,
      referencePeriodLabel: mechanics.referencePeriodLabel || orbit.per,
      circularSpeedKmS,
      deltaPercent,
      consistent: deltaPercent == null ? null : deltaPercent <= 1,
      note: mechanics.note || "Circular two-body approximation.",
    };
  }

  if (mechanics.model === "elliptical" && Number.isFinite(mechanics.semiMajorAxisKm) && Number.isFinite(mechanics.eccentricity)) {
    const a = mechanics.semiMajorAxisKm;
    const e = mechanics.eccentricity;
    if (a > 0 && e >= 0 && e < 1 && Number.isFinite(body.muKm3s2)) {
      const periodMin = (TWO_PI * Math.sqrt((a ** 3) / body.muKm3s2)) / 60;
      return {
        kind: "elliptical",
        centralBody: body.name,
        semiMajorAxisKm: a,
        eccentricity: e,
        periapsisKm: a * (1 - e),
        apoapsisKm: a * (1 + e),
        periodMin,
        periodLabel: formatDuration(periodMin),
      };
    }
  }

  return {
    kind: "incomplete",
    centralBody: body.name,
    perihelionKm: Number.isFinite(mechanics.perihelionKm) ? mechanics.perihelionKm : null,
    referencePeriodLabel: mechanics.referencePeriodLabel || orbit.per,
    note: mechanics.note || "A semi-major axis or aphelion is needed to calculate the full elliptical orbit.",
  };
}

export function renderOrbitAnalysis(orbit, bodies) {
  const a = analyzeOrbit(orbit, bodies);
  if (a.kind === "circular") {
    const statusClass = a.consistent === false ? "review" : "matched";
    const statusText = a.consistent === false ? "CHECK REFERENCE" : "PERIOD MATCH";
    const transferNote = orbit.id === "moon"
      ? `<p class="orbit-analysis-note">The Earth-to-Moon transfer is a separate trajectory leg. NASA's example depicts it with GMAT-generated Cartesian coordinates; this game checks the lunar destination orbit but does not propagate the transfer.</p><p class="orbit-analysis-sources"><a href="https://nasa.github.io/mission-viz/X3Dom/20160129_Earth_MoonMission_X3D.html" target="_blank" rel="noopener">NASA Earth–Moon mission example ↗</a></p>`
      : "";
    return `
      <section class="orbit-analysis" aria-live="polite">
        <div class="orbit-analysis-head">
          <div><div class="orbit-analysis-kicker">ORBITAL MECHANICS</div><h3>Kepler period check</h3></div>
          <span class="orbit-analysis-status ${statusClass}">${statusText}</span>
        </div>
        <div class="orbit-analysis-grid">
          <div><span>Central body</span><strong>${a.centralBody}</strong></div>
          <div><span>Altitude</span><strong>${fmt(a.altitudeKm)} km</strong></div>
          <div><span>Semi-major axis estimate</span><strong>${fmt(a.semiMajorAxisKm)} km</strong></div>
          <div><span>Kepler period</span><strong>${a.periodLabel}</strong></div>
          <div><span>Reference period</span><strong>${a.referencePeriodLabel}</strong></div>
          <div><span>Circular speed</span><strong>${a.circularSpeedKmS.toFixed(2)} km/s</strong></div>
          <div><span>Eccentricity model</span><strong>0 (assumed)</strong></div>
        </div>
        ${transferNote}
        <details class="orbit-analysis-method">
          <summary>Calculation method and limitations</summary>
          <p>Uses <code>T = 2π√(a³/μ)</code>, with <code>a = body radius + altitude</code> and an assumed circular orbit (<code>e = 0</code>). The estimate is compared with the period listed for this orbit.</p>
          <p>${a.note}</p>
          <p>This is a two-body consistency check, not a full trajectory propagator. It does not model perturbations, manoeuvres, or orbital-plane evolution.</p>
          <p class="orbit-analysis-sources"><a href="https://nasa.github.io/mission-viz/RMarkdown/Elliptical_Orbit_Design.html" target="_blank" rel="noopener">NASA elliptical-orbit tutorial ↗</a> · <a href="https://ssd.jpl.nasa.gov/astro_par.html" target="_blank" rel="noopener">JPL astrodynamic constants ↗</a></p>
        </details>
      </section>`;
  }

  if (a.kind === "elliptical") {
    return `
      <section class="orbit-analysis" aria-live="polite">
        <div class="orbit-analysis-head">
          <div><div class="orbit-analysis-kicker">ORBITAL MECHANICS</div><h3>Keplerian ellipse</h3></div>
          <span class="orbit-analysis-status matched">ELEMENTS PROVIDED</span>
        </div>
        <div class="orbit-analysis-grid">
          <div><span>Central body</span><strong>${a.centralBody}</strong></div>
          <div><span>Semi-major axis</span><strong>${fmt(a.semiMajorAxisKm)} km</strong></div>
          <div><span>Eccentricity</span><strong>${a.eccentricity.toFixed(4)}</strong></div>
          <div><span>Periapsis radius</span><strong>${fmt(a.periapsisKm)} km</strong></div>
          <div><span>Apoapsis radius</span><strong>${fmt(a.apoapsisKm)} km</strong></div>
          <div><span>Kepler period</span><strong>${a.periodLabel}</strong></div>
        </div>
        <details class="orbit-analysis-method">
          <summary>Calculation method and limitations</summary>
          <p>For the supplied semi-major axis <code>a</code> and eccentricity <code>e</code>, periapsis is <code>a(1 − e)</code>, apoapsis is <code>a(1 + e)</code>, and period is <code>T = 2π√(a³/μ)</code>.</p>
          <p>The NASA tutorial also discusses orbit orientation and Kepler-equation propagation. This panel computes the basic two-body elements only; it does not animate or numerically propagate a trajectory.</p>
          <p class="orbit-analysis-sources"><a href="https://nasa.github.io/mission-viz/RMarkdown/Elliptical_Orbit_Design.html" target="_blank" rel="noopener">NASA elliptical-orbit tutorial ↗</a> · <a href="https://ssd.jpl.nasa.gov/astro_par.html" target="_blank" rel="noopener">JPL astrodynamic constants ↗</a></p>
        </details>
      </section>`;
  }

  if (a.kind === "incomplete") {
    return `
      <section class="orbit-analysis" aria-live="polite">
        <div class="orbit-analysis-head">
          <div><div class="orbit-analysis-kicker">ORBITAL MECHANICS</div><h3>Trajectory data check</h3></div>
          <span class="orbit-analysis-status incomplete">ELEMENTS NEEDED</span>
        </div>
        <div class="orbit-analysis-grid orbit-analysis-grid-short">
          <div><span>Central body</span><strong>${a.centralBody}</strong></div>
          ${a.perihelionKm ? `<div><span>Perihelion distance</span><strong>${fmt(a.perihelionKm)} km</strong></div>` : ""}
          <div><span>Reference period</span><strong>${a.referencePeriodLabel}</strong></div>
        </div>
        <p class="orbit-analysis-note">${a.note}</p>
        <details class="orbit-analysis-method">
          <summary>What is needed for a full calculation?</summary>
          <p>The NASA tutorial describes an ellipse using its semi-major axis and eccentricity, with inclination and node angles defining its orientation. A perihelion distance alone is not enough to determine the period or the spacecraft's full path.</p>
          <p class="orbit-analysis-sources"><a href="https://nasa.github.io/mission-viz/RMarkdown/Elliptical_Orbit_Design.html" target="_blank" rel="noopener">NASA elliptical-orbit tutorial ↗</a></p>
        </details>
      </section>`;
  }

  return `
    <section class="orbit-analysis" aria-live="polite">
      <div class="orbit-analysis-head"><div><div class="orbit-analysis-kicker">ORBITAL MECHANICS</div><h3>Analysis unavailable</h3></div></div>
      <p class="orbit-analysis-note">${a.message}</p>
    </section>`;
}
