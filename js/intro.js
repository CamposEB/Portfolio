/* Intro: terminal digitando, nome decodificando, barra 0-100% e cortina.
   Ajuste a velocidade em TYPE_MS (digitação), SCRAMBLE_MS (nome) e BAR_MS (barra). */
(() => {
  const root = document.documentElement;
  // Utilitário global: executa fn quando a intro termina (ou já, se não houver intro)
  window.cwReady = (fn) => {
    let d = 0; const go = () => { if (!d) { d = 1; fn(); } };
    if (root.classList.contains("intro-on")) { addEventListener("intro:done", go); setTimeout(go, 6200); } else go();
  };
  const el = document.getElementById("intro");
  if (!el) return;
  if (!root.classList.contains("intro-on")) { el.remove(); return; }

  const TYPE_MS = 28, SCRAMBLE_MS = 900, BAR_MS = 2600;
  const $ = (s) => el.querySelector(s);
  const line = $(".i-line"), name = $(".i-name"), sub = $(".i-sub"), bar = $(".i-bar i"), pct = $(".i-pct");
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let done = false;

  function end() {
    if (done) return; done = true;
    try { sessionStorage.setItem("cw-intro", "1"); } catch (e) {}
    el.classList.add("open");
    setTimeout(() => { el.remove(); root.classList.remove("intro-on"); dispatchEvent(new Event("intro:done")); }, 900);
  }
  $(".i-skip").addEventListener("click", end);
  addEventListener("keydown", (e) => { if (e.key === "Escape") end(); });

  function scramble(target, ms) {
    const chars = "01{}<>/;#$%", t0 = performance.now();
    return new Promise((res) => {
      (function f(now) {
        const p = Math.min((now - t0) / ms, 1);
        name.textContent = [...target].map((c, i) => (c === " " ? " " : i / target.length < p ? c : chars[(Math.random() * chars.length) | 0])).join("");
        p < 1 ? requestAnimationFrame(f) : res();
      })(t0);
    });
  }

  (async () => {
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / BAR_MS, 1);
      bar.style.transform = `scaleX(${p})`; pct.textContent = Math.round(p * 100) + "%";
      if (!done && p < 1) requestAnimationFrame(tick);
    })(t0);
    for (const c of "> iniciando campos_web...") { if (done) return; line.textContent += c; await wait(TYPE_MS); }
    if (done) return;
    await scramble("RAFAEL CAMPOS", SCRAMBLE_MS);
    sub.classList.add("on");
    await wait(900);
    end();
  })();
})();
