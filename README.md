# Nebula Nomads · Space Mission Design Game

This is my attempt at the "Space Mission Design Game" Challenge of the NASA Space Apps Challenge 2026.
The prototype does not have any interesting major features, but it covers the basic aspects of
designing a space mission.

## FEATURES

- Designing a space mission and choosing the relevant resources
- Mission sequence timeline with rule-based launch, orbit, power, science, and downlink checks
- Non-visual Kepler period checks for selected orbits, with incomplete orbital elements clearly flagged

## NASA DATA

- NASA Pictures from: https://www.nasa.gov/
- Some pictures from: https://www.pexels.com/
- Design choices from: https://www.nasa.gov/wp-content/uploads/2025/04/250323-design-and-develop-science-mission.pdf?emrc=a454cf

## AI's used

- Claude
- CHAT-GPT
- Google Gemeni


## ORBITAL MECHANICS CHECKS

The Launch segment includes a non-visual orbital mechanics check inspired by two resources in NASA's Web-based Space Mission Visualization collection:

- [Earth–Moon Mission Visualization](https://nasa.github.io/mission-viz/X3Dom/20160129_Earth_MoonMission_X3D.html) demonstrates an Earth-to-Moon trajectory using Cartesian coordinates generated with NASA's General Mission Analysis Tool (GMAT). Nebula Nomads identifies the transfer leg for the lunar mission but does not claim to propagate GMAT state vectors; the current game data describes the destination lunar orbit only.
- [How to Design a 3D Elliptical Orbit](https://nasa.github.io/mission-viz/RMarkdown/Elliptical_Orbit_Design.html) explains Keplerian orbital elements and propagation. Nebula Nomads uses the two-body Kepler period equation for a clearly labelled circular approximation, and compares the result with the catalogue period. It does not recreate the NASA animated 3D orbit viewer.

The central-body constants are stored in `data/orbital-bodies.json`. They use JPL's [DE440 astrodynamic parameters](https://ssd.jpl.nasa.gov/astro_par.html) for gravitational parameters, plus NASA's [Earth Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html) and [Moon Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html) for radii.

**Model limits:** circular-orbit results are estimates, not a high-fidelity propagator. The Sun-synchronous check does not calculate J2-driven nodal precession. The Parker Solar Probe reference supplies perihelion and a broad period range, but not a semi-major axis or aphelion, so a full Kepler period is intentionally left uncomputed. The lunar transfer is not numerically propagated because no mission-specific GMAT state-vector file is included.
