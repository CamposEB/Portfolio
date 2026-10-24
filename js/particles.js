/* Constelação reativa ao mouse. Quantidade: N (desktop/mobile). Pausa fora da tela e com aba oculta. */
(() => {
  const c = document.getElementById("bg");
  if (!c || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const N = () => (innerWidth < 700 ? 28 : 65), x = c.getContext("2d"), host = c.parentElement;
  let w, h, pts = [], m = { x: -999, y: -999 }, vis = true, on = false;

  function size() {
    const r = host.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height; c.width = w * d; c.height = h * d; x.setTransform(d, 0, 0, d, 0, 0);
    pts = Array.from({ length: N() }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
  }
  size(); addEventListener("resize", size);
  host.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; });
  host.addEventListener("pointerleave", () => (m.x = -999));
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; loop(); }).observe(c);
  document.addEventListener("visibilitychange", loop);

  function loop() {
    if (on || !vis || document.hidden) return; on = true;
    (function f() {
      if (!vis || document.hidden) { on = false; return; }
      x.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - m.x, dy = p.y - m.y, d = dx * dx + dy * dy;
        if (d < 22000) { // repele de leve e liga ao cursor
          p.x += dx * .004; p.y += dy * .004;
          x.strokeStyle = `rgba(255,107,74,${.6 * (1 - d / 22000)})`;
          x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(m.x, m.y); x.stroke();
        }
        x.fillStyle = "rgba(77,141,255,.85)"; x.fillRect(p.x, p.y, 2, 2);
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
        if (d < 12000) { x.strokeStyle = `rgba(77,141,255,${.35 * (1 - d / 12000)})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); }
      }
      requestAnimationFrame(f);
    })();
  }
  loop();
})();
