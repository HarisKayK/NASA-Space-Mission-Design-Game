// ---- Data based on real NASA missions & published launch specs. "≈" = approximate or game simplification ----
const OBJ = [
  {
    id: "earth",
    n: "Earth observation",
    d: "Landsat 9 style land imaging.",
    disc: "Earth science",
    need: "Track changes to land over time so people can manage farms, water and cities.",
    goals: [
      "Image the land in several colours",
      "Cover the whole globe regularly",
      "Share the data freely",
    ],
    budget: 1000,
    months: 60,
  },
  {
    id: "moon",
    n: "Lunar science",
    d: "LRO style Moon mapping.",
    disc: "Planetary science",
    need: "Map the Moon so future missions know where to land and what hazards exist.",
    goals: [
      "Measure surface height and heat",
      "Take sharp surface images",
      "Measure radiation near the Moon",
    ],
    budget: 700,
    months: 12,
  },
  {
    id: "weather",
    n: "Weather monitoring",
    d: "GOES style weather watch.",
    disc: "Earth science",
    need: "Watch one region all the time so weather warnings come early.",
    goals: [
      "Stay fixed over one region",
      "Image the whole disk often",
      "Watch the Sun’s activity too",
    ],
    budget: 1300,
    months: 120,
  },
  {
    id: "solar",
    n: "Solar science",
    d: "PUNCH style Sun corona imaging.",
    disc: "Heliophysics",
    need: "Learn how the Sun’s outer atmosphere becomes the solar wind that fills the solar system.",
    goals: [
      "Image the Sun’s corona",
      "Keep the lighting steady",
      "Send the images to scientists",
    ],
    budget: 400,
    months: 24,
  },
];
const MAP = {
  earth: ["sso", "leo"],
  moon: ["moon"],
  weather: ["geo"],
  solar: ["sso"],
};
const SEGS = [
  {
    n: "Launch segment",
    d: "Gets the mission into space.",
    role: "Launch lead",
  },
  {
    n: "Space segment",
    d: "The spacecraft and instruments.",
    role: "Spacecraft engineer",
  },
  {
    n: "Ground segment",
    d: "Stations and mission control.",
    role: "Operations lead",
  },
  { n: "User segment", d: "People who use the data.", role: "Science lead" },
];
// Launch segment (cf = how much longer a ground station can see the orbit)
const ORB = [
  {
    id: "leo",
    n: "Low Earth orbit",
    use: "A close, fast orbit about 500 km up. You see fine detail and a lap takes about 95 minutes, but a ground station sees you only briefly each pass.",
    d: "Close views, short passes.",
    alt: "≈500 km",
    per: "95 min",
    life: 0.8,
    cf: 1,
    ref: "Period calculated from orbital physics.",
  },
  {
    id: "sso",
    n: "Sun-synchronous orbit",
    use: "A tilted orbit that passes over each place at the same local time every day. Lighting stays the same, so pictures can be compared over months and years. Landsat uses it.",
    d: "Steady lighting, global coverage.",
    alt: "705 km",
    per: "99 min",
    life: 1,
    cf: 1,
    ref: "Landsat 9: 705 km, 98.2° inclination, 99-minute period.",
  },
  {
    id: "geo",
    n: "Geostationary orbit",
    use: "An orbit so high that one lap takes 24 hours, the same as Earth’s spin. The spacecraft stays above one spot, so it can watch the weather there all the time.",
    d: "Fixed over one spot.",
    alt: "35,786 km",
    per: "24 h",
    life: 1,
    cf: 8,
    ref: "GOES weather satellites. Rockets reach it through a transfer orbit (GTO).",
  },
  {
    id: "moon",
    n: "Lunar polar orbit",
    use: "A low orbit over the Moon’s poles. As the Moon turns below, the spacecraft sees every part of it. It loses contact when it goes behind the Moon.",
    d: "Hidden behind the Moon at times.",
    alt: "≈50 km",
    per: "113 min",
    life: 0.9,
    cf: 2,
    ref: "LRO’s mapping orbit was ~50 km above the Moon.",
  },
];
const VEH = [
  {
    n: "Rocket Lab Electron",
    use: "A small rocket made for small satellites. It is cheap, but it lifts little weight and cannot reach the Moon or geostationary orbit.",
    d: "Small dedicated launcher.",
    cost: 7.5,
    cap: { leo: 300, sso: 225, geo: 0, moon: 0 },
    ref: "300 kg to LEO, ~225 kg to SSO, ~$7.5M.",
  },
  {
    n: "ULA Atlas V 401",
    use: "A proven rocket that NASA has used for many missions. It lifts medium to heavy spacecraft and launched both Landsat 9 and LRO.",
    d: "Proven NASA workhorse.",
    cost: 110,
    cap: { leo: 9800, sso: 6500, geo: 4750, moon: 2200 },
    ref: "Launched both Landsat 9 (2,711 kg) and LRO (1,916 kg). Cost ≈$110M; Atlas V 551 is ~$110M.",
  },
  {
    n: "SpaceX Falcon 9",
    use: "A medium-lift rocket with a listed price of about $67M. Good value for most missions.",
    d: "Medium-lift, listed commercial price.",
    cost: 67,
    cap: { leo: 22800, sso: 17000, geo: 8300, moon: 2100 },
    ref: "22,800 kg to LEO, 8,300 kg to GTO, $67M. Lunar figure is the heaviest flown (2,120 kg); SSO ≈ estimated.",
  },
  {
    n: "SpaceX Falcon Heavy",
    use: "The most powerful rocket here. It carries big, heavy spacecraft to far places, but it costs the most.",
    d: "Heavy lift for big payloads.",
    cost: 97,
    cap: { leo: 63800, sso: 47000, geo: 26700, moon: 15460 },
    ref: "63,800 kg to LEO, 26,700 kg to GTO, ~15,460 kg to the Moon (expendable), $97M list. NASA’s total launch cost for GOES-U on this rocket was $152.5M.",
  },
];
// Space segment
const BUS = [
  {
    n: "Small satellite bus",
    use: "The body of a small satellite. It holds the computer, fuel and frame. It is cheap and light, but lasts only about two years.",
    d: "Compact, low cost, short life.",
    mass: 250,
    cost: 60,
    load: 100,
    life: 24,
    ref: "≈ smallsat-class estimate.",
  },
  {
    n: "LRO-class bus",
    use: "A body built to orbit the Moon. It carries extra fuel so it can enter and hold a lunar orbit.",
    d: "Lunar orbiter with propellant for the Moon.",
    mass: 1869,
    cost: 250,
    load: 400,
    life: 36,
    ref: "LRO launch mass 1,916 kg minus the four instruments in the game; ~898 kg of that is fuel. Cost and load ≈ estimated.",
  },
  {
    n: "Landsat-class bus (LEOStar-3)",
    use: "A body for Earth-imaging satellites in a 705 km orbit. It points steadily and lasts about five years.",
    d: "Earth-observing platform for a 705 km orbit.",
    mass: 2071,
    cost: 300,
    load: 400,
    life: 63,
    ref: "Landsat 8 bus: 2,071 kg fully fuelled, without instruments; design life 5.25 years. Cost and load ≈ estimated.",
  },
  {
    n: "GOES-R-class bus (A2100)",
    use: "A big body for geostationary weather satellites. It has lots of fuel and a 15-year life, but it is heavy and costly.",
    d: "Big geostationary bus with lots of fuel.",
    mass: 4854,
    cost: 450,
    load: 600,
    life: 180,
    ref: "GOES-R launch mass 5,192 kg minus the ABI imager; 15-year design life. Cost and load ≈ estimated.",
  },
];
const POW = [
  {
    n: "Small solar array",
    use: "Small solar panels. Light and cheap, but they make little power.",
    d: "Enough for a small satellite.",
    mass: 30,
    cost: 15,
    gen: 300,
    ref: "≈ estimated.",
  },
  {
    n: "LRO-class solar array",
    use: "Medium panels. Enough power for a few instruments on a science orbiter.",
    d: "Typical science orbiter.",
    mass: 80,
    cost: 40,
    gen: 685,
    ref: "LRO’s spacecraft power was ~685 W.",
  },
  {
    n: "Landsat-class solar array",
    use: "Large panels for power-hungry imagers.",
    d: "Large array for power-hungry imagers.",
    mass: 300,
    cost: 90,
    gen: 3750,
    ref: "Landsat 8: 9 × 0.4 m array, 3,750 W at end of mission.",
  },
  {
    n: "GOES-R-class solar array",
    use: "The largest panels here, made for big geostationary satellites.",
    d: "Largest option for big geostationary satellites.",
    mass: 350,
    cost: 100,
    gen: 4000,
    ref: "GOES-R: more than 4,000 W at end of life.",
  },
];
const COM = [
  {
    n: "S-band low-rate antenna",
    use: "A simple, light radio. It is fine for commands and small amounts of data, but too slow for lots of pictures.",
    d: "Simple and light, but slow.",
    mass: 5,
    cost: 5,
    pow: 20,
    rate: 2,
    ref: "≈ 2 Mbps (estimated).",
  },
  {
    n: "Ka-band high-gain antenna",
    use: "A fast radio link with a dish. It sends much more data, but needs more power.",
    d: "Fast downlink, needs more power.",
    mass: 40,
    cost: 25,
    pow: 100,
    rate: 100,
    ref: "LRO: 100 Mbps Ka-band downlink. GOES-R also sends up to 100 Mbps.",
  },
  {
    n: "X-band dual-channel downlink",
    use: "Two fast channels for huge image volumes, like Landsat 8 uses. It needs the most power and mass.",
    d: "Very fast, for big imaging data volumes.",
    mass: 50,
    cost: 35,
    pow: 150,
    rate: 384,
    ref: "Landsat 8: 384 Mbps X-band over two channels. Mass, power, cost ≈ estimated.",
  },
];
const INS = [
  {
    n: "CRaTER radiation telescope",
    use: "Space radiation can harm astronauts and electronics. This tool counts the fast particles near the Moon, so engineers can plan safer missions.",
    meas: "Radiation particles and how much energy they carry",
    d: "Measures space radiation.",
    mass: 5.4,
    pow: 7.3,
    cost: 10,
    data: 0.04,
    sci: 8,
    fit: ["moon"],
    ref: "LRO: 5.4 kg, 7.3 W, ~0.5 kbps. Cost ≈ estimated.",
  },
  {
    n: "Diviner radiometer",
    use: "Measures how hot or cold the ground is. It helps find very cold shadowed places where ice could hide, and tells scientists what the rock is like.",
    meas: "Surface temperature, day and night",
    d: "Maps surface temperatures.",
    mass: 11,
    pow: 24.7,
    cost: 25,
    data: 5,
    sci: 25,
    fit: ["moon"],
    ref: "LRO: 11 kg, 24.7 W. Cost and data ≈ estimated.",
  },
  {
    n: "LOLA laser altimeter",
    use: "Shoots laser pulses at the ground and times the echo. This gives exact heights, so scientists can make 3D maps and find safe landing spots.",
    meas: "Height and slope of the ground",
    d: "Measures height and slopes.",
    mass: 11.3,
    pow: 33.4,
    cost: 30,
    data: 0.9,
    sci: 30,
    fit: ["moon", "earth"],
    ref: "LRO press kit: 11.3 kg, 33.4 W (fact sheet: 9.6 kg, 26.2 W), 10 kbps. Cost ≈ estimated.",
  },
  {
    n: "LROC camera",
    use: "A camera that takes sharp pictures of the surface. Scientists use it to spot rocks, craters and possible landing sites.",
    meas: "Detailed pictures of the surface",
    d: "High-resolution surface images.",
    mass: 19.2,
    pow: 24,
    cost: 40,
    data: 450,
    sci: 40,
    fit: ["moon"],
    ref: "LRO: 19.2 kg, 24 W. LRO’s whole measurement volume was ~572 Gb/day, so data and cost ≈ estimated.",
  },
  {
    n: "Multispectral imager (OLI-2 class)",
    use: "Takes pictures in several colours of visible and infrared light. Each colour shows something different, like healthy plants, water, or new buildings.",
    meas: "Sunlight reflected from land, in several colours",
    d: "Visible and infrared land imaging.",
    mass: 400,
    pow: 425,
    cost: 120,
    data: 300,
    sci: 60,
    fit: ["earth"],
    ref: "Mass and power are NASA’s not-to-exceed limits for OLI (400 kg, 425 W average); the real instrument is lighter. Landsat 9 collects 700+ scenes/day. Cost and data ≈ estimated.",
  },
  {
    n: "Advanced Baseline Imager (ABI)",
    use: "Takes pictures of clouds, storms, fires and dust across a whole half of the Earth, again and again. Forecasters use them to spot dangerous weather early.",
    meas: "Clouds, storms, fire and dust in 16 colour bands",
    d: "16-band weather imaging of a full hemisphere.",
    mass: 338,
    pow: 450,
    cost: 255,
    data: 5702,
    sci: 60,
    fit: ["weather"],
    ref: "GOES-R ABI: 338 kg, 450 W, 66 Mbps (≈5,700 Gb/day). $255M is the real contract for development, a prototype and two flight units.",
  },
  {
    n: "EXIS solar sensors",
    use: "Watches the Sun’s X-rays and ultraviolet light. Sudden bursts can disturb radio signals and satellites, so this gives an early warning.",
    meas: "Brightness of the Sun in X-rays and ultraviolet",
    d: "Watches the Sun’s X-rays and ultraviolet light.",
    mass: 30,
    pow: 40,
    cost: 25,
    data: 0.6,
    sci: 10,
    fit: ["weather"],
    ref: "GOES-R EXIS: 30 kg, 40 W, 7.2 kbps. Cost ≈ estimated.",
  },
  {
    n: "Coronal imager",
    use: "Takes pictures of the Sun’s faint outer atmosphere, called the corona, and of the solar wind flowing out of it. It helps explain how the Sun affects the whole solar system.",
    meas: "Light from the Sun’s corona",
    d: "Images the Sun’s outer atmosphere.",
    mass: 25,
    pow: 30,
    cost: 40,
    data: 20,
    sci: 45,
    fit: ["solar"],
    ref: "PUNCH images the Sun’s corona and the solar wind. All numbers ≈ estimated.",
  },
];
// Ground segment (h = hours per day of contact for a low orbit)
const GND = [
  {
    n: "Single university station",
    use: "One antenna. It sees the spacecraft only briefly each orbit, so little data comes home. It is cheap.",
    d: "One antenna sees the spacecraft briefly each orbit.",
    cost: 10,
    h: 1,
    ref: "≈ 1 h/day.",
  },
  {
    n: "Regional ground network",
    use: "Several stations spread out, so you can talk to the spacecraft for more of each day.",
    d: "Several stations for steady contact.",
    cost: 60,
    h: 3,
    ref: "≈ 3 h/day.",
  },
  {
    n: "Relay satellite network",
    use: "Relay satellites pass data along, giving near-constant contact. It costs the most.",
    d: "Relay satellites for near-continuous contact.",
    cost: 150,
    h: 8,
    ref: "Like NASA’s Near Space Network. ≈ 8 h/day.",
  },
];
const CTL = [
  {
    n: "Part-time operations team",
    use: "A small team that works set hours. It is cheap, but slow to react when something goes wrong.",
    d: "Cheap, but slow to react when problems appear.",
    cost: 20,
    rel: 0.85,
  },
  {
    n: "24/7 mission control",
    use: "A team that is always on watch and fixes problems quickly. NASA teams stay on console during key operations in case of problems.",
    d: "Always watching, quick fixes; costs more.",
    cost: 60,
    rel: 1,
  },
];
// User segment
const USR = [
  {
    n: "Mission science team only",
    use: "Only the instrument teams use the data, so few people benefit.",
    d: "Only the instrument teams use the data.",
    cost: 15,
    mult: 0.8,
    users: "~100 users",
  },
  {
    n: "Public science archive",
    use: "The data goes to an open archive that any researcher can use, like NASA’s Planetary Data System.",
    d: "Data goes to an open archive for researchers.",
    cost: 35,
    mult: 1,
    users: "1,000s of users",
    ref: "Like NASA’s Planetary Data System, where LRO data is archived.",
  },
  {
    n: "Free and open data portal",
    use: "Anyone can download the data, like Landsat data from USGS. This reaches the most people.",
    d: "Anyone can download and use the data.",
    cost: 80,
    mult: 1.25,
    users: "millions of users",
    ref: "Landsat data is free to the public through USGS (9 million+ scenes).",
  },
];

const S = {
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
  mode: "solo",
};
const TABS = ["Mission", "Launch", "Space", "Ground", "User", "Simulate"];
const $ = (id) => document.getElementById(id);

function calc() {
  const o = OBJ[S.obj],
    bu = BUS[S.bus],
    p = POW[S.pow],
    c = COM[S.com],
    orb = ORB[S.orb],
    v = VEH[S.veh],
    g = GND[S.gnd],
    k = CTL[S.ctl],
    u = USR[S.usr];
  const ins = [...S.ins].map((i) => INS[i]),
    sum = (x) => ins.reduce((a, b) => a + b[x], 0);
  const seg = {
    launch: v.cost,
    space: bu.cost + p.cost + c.cost + sum("cost"),
    ground: g.cost + k.cost,
    user: u.cost,
  };
  const hours = Math.min(24, g.h * orb.cf);
  const sci = ins.reduce(
    (a, i) => a + i.sci * (i.fit.includes(o.id) ? 1 : 0.3),
    0,
  );
  const misfit = ins.filter((i) => !i.fit.includes(o.id)).length;
  return {
    o,
    orb,
    v,
    g,
    k,
    u,
    seg,
    hours,
    sci,
    misfit,
    mass: Math.round(bu.mass + p.mass + c.mass + sum("mass")),
    cap: v.cap[orb.id],
    powUse: Math.round(bu.load + c.pow + sum("pow")),
    gen: p.gen,
    cost: Math.round(seg.launch + seg.space + seg.ground + seg.user),
    budget: o.budget,
    data: Math.round(sum("data")),
    down: Math.round(c.rate * hours * 3.6),
    life: Math.round(bu.life * orb.life),
    months: o.months,
    orbOK: MAP[o.id].includes(orb.id),
  };
}
function res(l, val, pct, bad, calm) {
  return `<div class="card res"><div class="lbl">${l}</div><div class="val mono">${val}</div><div class="bar"><i style="width:${Math.min(100, pct)}%;background:${bad ? "var(--bad)" : !calm && pct > 85 ? "var(--warn)" : "var(--ok)"}"></i></div></div>`;
}
function hud() {
  const c = calc();
  $("hud").innerHTML =
    res(
      "Mass",
      `${c.mass} / ${c.cap} kg`,
      (c.mass / Math.max(c.cap, 1)) * 100,
      c.mass > c.cap,
    ) +
    res(
      "Power",
      `${c.powUse} / ${c.gen} W`,
      (c.powUse / c.gen) * 100,
      c.powUse > c.gen,
    ) +
    res(
      "Budget",
      `$${c.cost} / ${c.budget} M`,
      (c.cost / c.budget) * 100,
      c.cost > c.budget,
    ) +
    res(
      "Data / day",
      `${c.data} / ${c.down} Gb`,
      (c.data / c.down) * 100,
      c.data > c.down,
    ) +
    res(
      "Lifetime",
      `${c.life} / ${c.months} mo`,
      (c.life / c.months) * 100,
      c.life < c.months,
      true,
    );
}
function opt(item, sel, fn, tags, off, svg) {
  const b = document.createElement("button");
  b.title = item.tip || "";
  b.className = "opt" + (sel ? " sel" : "") + (off ? " off" : "");
  b.innerHTML = `${svg ? `<div class="ico">${svg}</div>` : ""}<h3>${item.n}</h3>${item.d ? `<p>${item.d}</p>` : ""}<div class="tags mono">${tags.map((t) => `<span>${t}</span>`).join("")}</div>`;
  b.onclick = fn;
  return b;
}
function fill(id, arr, isSel, fn, tagf, offf) {
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
          render();
        },
        tagf(x),
        offf && offf(x),
        k ? sv(ICON[k](x, i)) : "",
      ),
    ),
  );
}

// ---- Illustrations (inline SVG, 120x72 boxes, subtle animation) ----
let uid = 0;
const cid = () => "k" + ++uid;
const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
const sv = (c) =>
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
const ICON = {
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
const KIND = {
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
const LISTS = {
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
// Live mission diagram: launch > orbit > spacecraft > ground > users
function viz() {
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
const TIPS = [
  "Start with the need and goals. They set your budget, lifetime and orbit. Begin with the end in mind: who will use the data?",
  "Farther orbits reduce what a rocket can lift.",
  "Power must cover every load. Instruments must suit the objective.",
  "More contact time means more data returned.",
  "Begin with the end in mind: decide what data users need, then work backward.",
  "There is no single perfect design. Try again.",
];
// ---- From NASA "Design and Develop Science Missions" (Mar 2025) ----
const EX = [
  {
    n: "PUNCH",
    d: "Four small satellites image the Sun’s corona in 3D.",
    u: "https://science.nasa.gov/mission/punch/",
  },
  {
    n: "PILOT",
    d: "A fleet of 34 satellites studies plasma around Earth’s magnetosphere.",
    u: "https://advancedspace.com/pilot-magnetosphere-science-missiondesign/",
  },
  {
    n: "Dawn",
    d: "First spacecraft to orbit two bodies: Vesta and Ceres.",
    u: "https://exploreintrosems.stanford.edu/news/aa-118n-how-design-space-mission-concept-execution",
  },
  {
    n: "Mars Moon Sampler",
    d: "Brings samples home to learn where Phobos and Deimos came from.",
    u: "https://www1.grc.nasa.gov/facilities/compass-lab/designs-by-type/",
  },
  {
    n: "Space Launch System",
    d: "Heavy-lift rocket for exploration goals.",
    u: "https://ntrs.nasa.gov/api/citations/20130013034/downloads/20130013034.pdf",
  },
  {
    n: "Artemis",
    d: "Exploration program for long stays on the Moon.",
    u: "https://en.wikipedia.org/wiki/Artemis_program",
  },
];
function reqs(c) {
  return [
    [
      c.mass <= c.cap,
      `Mass ≤ ${c.cap.toLocaleString()} kg (rocket limit)`,
      "add up the part masses",
    ],
    [
      c.powUse <= c.gen,
      `Power use ≤ ${c.gen} W`,
      "add up the loads, compare to array output",
    ],
    [
      c.data <= c.down,
      `Return all ${c.data} Gb/day of data`,
      "compare data made to data sent down",
    ],
    [
      c.life >= c.months,
      `Work for ${c.months} months`,
      "compare design life to mission length",
    ],
    [c.cost <= c.budget, `Cost ≤ $${c.budget}M`, "add up the segment costs"],
    [c.orbOK, "Orbit suits the objective", "check the objective’s orbit list"],
    [
      c.misfit == 0,
      "Every instrument suits the objective",
      "check each instrument’s fit",
    ],
  ];
}
function extras(c) {
  const o = c.o;
  $("brief").innerHTML =
    `<div class="ref">${o.disc} · mission need</div><p class="briefp">${o.need}</p><div class="tags">${o.goals.map((g, i) => `<span>Goal ${i + 1}: ${g}</span>`).join("")}</div>`;
  const ins = [...S.ins].map((i) => INS[i].n.replace(/ \(.*\)/, ""));
  $("conops").innerHTML = [
    [
      "Launch",
      `${c.v.n} lifts ${c.mass.toLocaleString()} kg to the ${c.orb.n.toLowerCase()} (${c.orb.alt}).`,
    ],
    [
      "Operate",
      `The ${BUS[S.bus].n.toLowerCase()} runs ${ins.length ? ins.join(", ") : "no instruments"} for ${c.life} months.`,
    ],
    [
      "Ground",
      `${c.g.n} gets about ${c.hours} h/day of contact. ${c.k.n} runs the mission.`,
    ],
    ["Users", `${c.u.n}: ${c.u.users}.`],
  ]
    .map((x, i) => `<div><b>${i + 1}. ${x[0]}</b><br>${x[1]}</div>`)
    .join("");
  $("reqs").innerHTML = reqs(c)
    .map(
      (r) =>
        `<div class="chk ${r[0] ? "ok" : "bad"}">${r[0] ? "✓" : "✗"} ${r[1]}<span class="ver"> · verify: ${r[2]}</span></div>`,
    )
    .join("");
  $("ex").innerHTML = EX.map(
    (e) =>
      `<a class="opt" href="${e.u}" target="_blank" rel="noopener"><h3>${e.n}</h3><p>${e.d}</p></a>`,
  ).join("");
}
function render() {
  const c = calc(),
    cs = [null, c.seg.launch, c.seg.space, c.seg.ground, c.seg.user, null];
  $("tabs").innerHTML = TABS.map(
    (t, i) =>
      `<button data-i="${i}" class="${i == S.tab ? "on" : ""}">${i + 1} · ${t}${cs[i] ? `<span class="cost">$${Math.round(cs[i])}M</span>` : ""}</button>`,
  ).join("");
  document
    .querySelectorAll(".panel")
    .forEach((p, i) => p.classList.toggle("on", i == S.tab));
  fill(
    "g-obj",
    OBJ,
    (i) => i == S.obj,
    (i) => (S.obj = i),
    (o) => [
      `$${o.budget}M`,
      `${o.months} mo`,
      "orbit: " + MAP[o.id].join("/"),
      o.disc,
    ],
  );
  fill(
    "g-orb",
    ORB,
    (i) => i == S.orb,
    (i) => (S.orb = i),
    (o) => [o.alt, "period " + o.per],
  );
  fill(
    "g-veh",
    VEH,
    (i) => i == S.veh,
    (i) => (S.veh = i),
    (o) => [
      "$" + o.cost + "M",
      "to orbit: " + (o.cap[ORB[S.orb].id] || 0).toLocaleString() + " kg",
    ],
    (o) => !o.cap[ORB[S.orb].id],
  );
  fill(
    "g-bus",
    BUS,
    (i) => i == S.bus,
    (i) => (S.bus = i),
    (o) => [
      o.mass + " kg",
      "$" + o.cost + "M",
      o.load + " W load",
      o.life + " mo life",
    ],
  );
  fill(
    "g-pow",
    POW,
    (i) => i == S.pow,
    (i) => (S.pow = i),
    (o) => [o.mass + " kg", o.gen + " W", "$" + o.cost + "M"],
  );
  fill(
    "g-com",
    COM,
    (i) => i == S.com,
    (i) => (S.com = i),
    (o) => [o.mass + " kg", o.pow + " W", o.rate + " Mbps", "$" + o.cost + "M"],
  );
  fill(
    "g-ins",
    INS,
    (i) => S.ins.has(i),
    (i) => (S.ins.has(i) ? S.ins.delete(i) : S.ins.add(i)),
    (o) => [
      o.mass + " kg",
      o.pow + " W",
      "$" + o.cost + "M",
      o.data + " Gb/d",
      "★" + o.sci,
    ],
  );
  fill(
    "g-gnd",
    GND,
    (i) => i == S.gnd,
    (i) => (S.gnd = i),
    (o) => ["$" + o.cost + "M", "≈" + o.h + " h/day"],
  );
  fill(
    "g-ctl",
    CTL,
    (i) => i == S.ctl,
    (i) => (S.ctl = i),
    (o) => ["$" + o.cost + "M", "reliability " + Math.round(o.rel * 100) + "%"],
  );
  fill(
    "g-usr",
    USR,
    (i) => i == S.usr,
    (i) => (S.usr = i),
    (o) => ["$" + o.cost + "M", o.users, "impact ×" + o.mult],
  );
  $("flow").innerHTML = "";
  SEGS.forEach((s, i) => {
    const b = opt(
      { n: s.n, d: s.d },
      false,
      () => {
        S.tab = i + 1;
        render();
      },
      ["$" + Math.round(Object.values(c.seg)[i]) + "M"],
      false,
      sv(ICON.seg(i)),
    );
    b.querySelector("h3").dataset.n = i + 1;
    $("flow").appendChild(b);
  });
  $("team").innerHTML = SEGS.map(
    (s, i) =>
      `<div class="opt" style="flex:1 1 200px;cursor:default"><h3>Player ${i + 1}</h3><p>${s.role}</p></div>`,
  ).join("");
  $("tip").textContent = TIPS[S.tab];
  $("viz").innerHTML = viz();
  extras(c);
  hud();
}
function simulate() {
  const c = calc(),
    checks = [];
  const add = (ok, t) =>
    checks.push(
      `<div class="chk ${ok ? "ok" : "bad"}">${ok ? "✓" : "✗"} ${t}</div>`,
    );
  add(
    c.mass <= c.cap,
    c.mass <= c.cap
      ? `Launch: ${c.mass.toLocaleString()} of ${c.cap.toLocaleString()} kg.`
      : `Launch failed: ${c.mass.toLocaleString()} kg exceeds the ${c.cap.toLocaleString()} kg limit.`,
  );
  add(
    c.powUse <= c.gen,
    c.powUse <= c.gen
      ? "Power: enough for all systems."
      : `Power short: need ${c.powUse} W, have ${c.gen} W.`,
  );
  add(
    c.misfit == 0,
    c.misfit == 0
      ? "Payload: suits the objective."
      : `Payload: ${c.misfit} instrument(s) don’t suit the objective (30% value).`,
  );
  add(
    c.data <= c.down,
    c.data <= c.down
      ? `Data: all ${c.data} Gb/day returned.`
      : `Data loss: ${c.data} Gb/day collected, ${c.down} sent.`,
  );
  add(
    c.k.rel >= 1,
    c.k.rel >= 1
      ? "Control: fast fixes."
      : "Control: part-time team lowers reliability.",
  );
  add(
    c.u.mult >= 1,
    c.u.mult >= 1
      ? `Users: ${c.u.users.replace(" users", "")} reached.`
      : "Users: limited reach.",
  );
  add(
    c.orbOK,
    c.orbOK
      ? "Orbit suits the objective."
      : "Orbit doesn’t suit the objective.",
  );
  add(
    c.life >= c.months,
    c.life >= c.months
      ? `Lifetime: ${c.life} of ${c.months} mo.`
      : `Lifetime too short: ${c.life} of ${c.months} mo.`,
  );
  add(
    c.cost <= c.budget,
    c.cost <= c.budget
      ? `Budget: $${c.budget - c.cost}M left.`
      : `Over budget by $${c.cost - c.budget}M.`,
  );
  let s =
    c.sci *
    (c.orbOK ? 1 : 0.4) *
    Math.min(1, c.down / Math.max(c.data, 1)) *
    Math.min(1, c.life / c.months) *
    (c.powUse <= c.gen ? 1 : 0.3) *
    c.k.rel *
    c.u.mult;
  if (c.mass > c.cap || c.cost > c.budget) s = 0;
  const eff =
      c.cost <= c.budget
        ? Math.round(((c.budget - c.cost) / c.budget) * 20)
        : 0,
    sci = Math.round(s);
  const names = ["Launch", "Space", "Ground", "User"];
  $("out").innerHTML =
    `<div class="row"><div><div class="sub">Mission score</div><div class="score mono">${sci + eff}</div></div><div class="sub">Science ${sci} + budget efficiency ${eff}</div></div>` +
    `<div class="seglist">${Object.values(c.seg)
      .map(
        (v, i) =>
          `<div><b>${names[i]} segment</b><br><span class="mono">$${Math.round(v)}M</span></div>`,
      )
      .join("")}</div>` +
    `<h3 class="subh">Build &amp; verify: does the design meet each requirement?</h3>` +
    checks.join("");
}
$("tabs").onclick = (e) => {
  const b = e.target.closest("button");
  if (b) {
    S.tab = +b.dataset.i;
    render();
  }
};
$("run").onclick = simulate;
$("mode").onclick = (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  S.mode = b.dataset.m;
  [...$("mode").children].forEach((x) => x.classList.toggle("on", x == b));
  $("team").style.display = S.mode == "team" ? "flex" : "none";
};
// Side panel with details and fit verdicts (hover or keyboard focus)
const info = $("insinfo");
function hideInfo() {
  info.classList.remove("on");
}
const orbNames = (o) =>
  MAP[o.id]
    .map((id) => ORB.find((y) => y.id == id).n.toLowerCase())
    .join(" or ");
// What would happen if this option were picked, with everything else as it is now
function fitOf(k, i) {
  const o = OBJ[S.obj];
  if (k == "obj") return null;
  if (k == "ins") {
    const n = INS[i];
    return n.fit.includes(o.id)
      ? ["ok", "Suits your objective."]
      : ["warn", `Weak fit for ${o.n} (30% value).`];
  }
  const keep = S[k];
  S[k] = i;
  const c = calc();
  S[k] = keep;
  const x = LISTS[k][i],
    L = (n) => n.toLocaleString();
  switch (k) {
    case "orb":
      return c.orbOK
        ? ["ok", `Suits ${o.n}.`]
        : ["no", `Doesn’t suit ${o.n}. It needs ${orbNames(o)}.`];
    case "veh": {
      if (!MAP[o.id].some((id) => x.cap[id] > 0))
        return ["no", `Can’t reach the orbit ${o.n} needs.`];
      const cap = x.cap[c.orb.id];
      if (!cap)
        return ["no", `Can’t reach the ${c.orb.n.toLowerCase()} you picked.`];
      return c.mass > cap
        ? [
            "no",
            `Too heavy: your design is ${L(c.mass)} kg, it lifts ${L(cap)} kg.`,
          ]
        : ["ok", `Lifts your ${L(c.mass)} kg design (limit ${L(cap)} kg).`];
    }
    case "bus":
      return c.life >= c.months
        ? ["ok", `Lasts ${c.life} months. ${o.n} needs ${c.months}.`]
        : [
            "no",
            `Too short: lasts ${c.life} months, ${o.n} needs ${c.months}.`,
          ];
    case "pow":
      return c.powUse <= c.gen
        ? ["ok", `Makes ${L(c.gen)} W. Your design uses ${L(c.powUse)} W.`]
        : [
            "no",
            `Too little: makes ${L(c.gen)} W, your design needs ${L(c.powUse)} W.`,
          ];
    case "com":
    case "gnd":
      return c.data <= c.down
        ? [
            "ok",
            `Sends back ${L(c.down)} Gb/day. Your instruments make ${L(c.data)}.`,
          ]
        : [
            "warn",
            `Sends only ${L(c.down)} Gb/day. Your instruments make ${L(c.data)}, so data is lost.`,
          ];
    case "ctl":
      return x.rel >= 1
        ? ["ok", "Fast fixes. Full reliability."]
        : ["warn", `Slower to react. Score ×${x.rel}.`];
    case "usr":
      return x.mult >= 1
        ? ["ok", `Reaches ${x.users}. Score ×${x.mult}.`]
        : ["warn", `Limited reach. Score ×${x.mult}.`];
  }
}
function showInfo(card, k) {
  const i = [...card.parentNode.children].indexOf(card),
    x = LISTS[k][i];
  if (!x) return;
  const f = fitOf(k, i),
    strip = (s) => s.replace(/ \(.*\)/, "");
  let b = `<h4>${x.n}</h4><p>${x.use || x.need}</p>`;
  if (k == "ins")
    b += `<div class="k">Measures</div><p>${x.meas}</p><div class="k">Best for</div><p>${x.fit.map((id) => OBJ.find((y) => y.id == id).n).join(", ")}</p>`;
  if (k == "obj")
    b += `<div class="k">Goals</div><p>${x.goals.join(" · ")}</p><div class="k">Needs orbit</div><p>${orbNames(x)}</p><div class="k">Instruments that suit it</div><p>${INS.filter(
      (n) => n.fit.includes(x.id),
    )
      .map((n) => strip(n.n))
      .join(", ")}</p>`;
  if (f)
    b += `<p class="fit${f[0]}">${{ ok: "✓", warn: "⚠", no: "✗" }[f[0]]} ${f[1]}</p>`;
  const sp = [...card.querySelectorAll(".tags span")]
    .map((s) => s.textContent)
    .join(" · ");
  if (sp) b += `<div class="k">Specs</div><p class="mono">${sp}</p>`;
  if (x.ref) b += `<p class="ref">${x.ref}</p>`;
  info.innerHTML = b;
  const r = card.getBoundingClientRect(),
    w = 280,
    g = 12,
    h = info.offsetHeight;
  let px = r.right + g,
    py = r.top;
  if (px + w > innerWidth - 8) px = r.left - g - w;
  if (px < 8) {
    px = Math.max(8, Math.min(r.left, innerWidth - w - 8));
    py = r.bottom + 8;
    if (py + h > innerHeight - 8) py = r.top - h - 8;
  }
  py = Math.max(8, Math.min(py, innerHeight - h - 8));
  info.style.left = px + "px";
  info.style.top = py + "px";
  info.classList.add("on");
}
for (const id in KIND) {
  const g = $(id);
  for (const ev of ["mouseover", "focusin"])
    g.addEventListener(ev, (e) => {
      const c = e.target.closest(".opt");
      if (c) showInfo(c, KIND[id]);
    });
  for (const ev of ["mouseleave", "focusout"]) g.addEventListener(ev, hideInfo);
}
addEventListener("scroll", hideInfo, true);

render();

// Starfield: three layers drifting left forever
const cv = $("stars"),
  cx = cv.getContext("2d");
let W,
  H,
  stars = [];
function init() {
  W = cv.width = innerWidth * devicePixelRatio;
  H = cv.height = innerHeight * devicePixelRatio;
  const n = Math.round((innerWidth * innerHeight) / 6000);
  stars = Array.from({ length: n }, () => {
    const z = Math.random();
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: (0.4 + z * 1.2) * devicePixelRatio,
      v: (0.1 + z * 0.6) * devicePixelRatio,
      a: 0.3 + z * 0.7,
    };
  });
}
const still = matchMedia("(prefers-reduced-motion:reduce)").matches;
function frame() {
  cx.clearRect(0, 0, W, H);
  for (const s of stars) {
    s.x -= still ? 0 : s.v;
    if (s.x < -2) s.x = W + 2;
    cx.globalAlpha = s.a;
    cx.fillStyle = "#cfe0ff";
    cx.beginPath();
    cx.arc(s.x, s.y, s.r, 0, 6.283);
    cx.fill();
  }
  requestAnimationFrame(frame);
}
addEventListener("resize", init);
init();
frame();
