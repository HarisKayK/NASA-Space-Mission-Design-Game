import { $ } from "../state.js";

export function startStarfield() {
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
}
