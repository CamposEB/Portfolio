(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };
  const ext = (txt, href, cls) => { const a = h("a", cls, txt); a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer"; return a; };
  const wa = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  const labeled = (label, text) => { const p = h("p"); p.append(h("strong", "", label + " "), document.createTextNode(text)); return p; };
  const root = document.documentElement;
  const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const FINE = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  if (!CONFIG.whatsapp) console.warn("Campos Web: defina CONFIG.whatsapp em js/projects.js.");
  $$("[data-wa]").forEach((a) => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener noreferrer"; });
  $("#year").textContent = new Date().getFullYear();

  // Inclinação 3D que segue o mouse (host = área que escuta o mouse)
  const tilt = (el, max, host = el) => {
    if (!FINE || RM || !el) return;
    host.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--ry", clamp((e.clientX - r.left) / r.width - .5, -.5, .5) * max + "deg");
      el.style.setProperty("--rx", -clamp((e.clientY - r.top) / r.height - .5, -.5, .5) * max + "deg");
    });
    host.addEventListener("pointerleave", () => { el.style.removeProperty("--ry"); el.style.removeProperty("--rx"); });
  };

  // Projetos (sem innerHTML: tudo via textContent)
  const box = $("#projects");
  (typeof PROJECTS !== "undefined" ? PROJECTS : []).forEach((p, i) => {
    const c = h("article", "pcard");
    c.style.setProperty("--i", i);
    const info = h("div", "pinfo");
    info.append(h("span", "tag", p.categoria), h("h3", "", p.nome), h("p", "", p.descricao));
    if (p.desafio) info.append(labeled("Desafio:", p.desafio));
    if (p.solucao) info.append(labeled("Solução:", p.solucao));
    if (p.tech && p.tech.length) { const ul = h("ul", "chips"); p.tech.forEach((t) => ul.append(h("li", "", t))); info.append(ul); }
    const act = h("div", "actions");
    if (p.url) act.append(ext("Abrir projeto", p.url, "btn sm"));
    act.append(ext("Quero algo parecido", wa(`Olá! Vi o projeto "${p.nome}" no seu portfólio e quero algo parecido.`), "btn ghost sm"));
    info.append(act);

    const frame = h("div", "frame"), bar = h("div", "fbar");
    let host = ""; try { host = new URL(p.url).host; } catch (e) {}
    bar.append(h("i"), h("i"), h("i"), h("span", "", host));
    const ph = () => h("div", "ph", p.nome.charAt(0));
    frame.append(bar);
    if (p.imagem) {
      const img = h("img"); img.src = p.imagem; img.alt = `Captura de tela do projeto ${p.nome}`; img.loading = "lazy";
      img.addEventListener("error", () => img.replaceWith(ph()));
      frame.append(img);
    } else frame.append(ph());
    c.append(info, frame); box.append(c);

    if (FINE && !RM) { // brilho que segue o mouse + inclinação do preview
      c.addEventListener("pointermove", (e) => { const r = c.getBoundingClientRect(); c.style.setProperty("--gx", e.clientX - r.left + "px"); c.style.setProperty("--gy", e.clientY - r.top + "px"); });
      tilt(frame, 6);
    }
  });
  if (!box.children.length) $("#projetos").hidden = true;

  // Hero: luz que segue o mouse + inclinação do terminal
  const hero = $(".hero");
  if (hero && FINE && !RM) {
    let f;
    hero.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(f);
      f = requestAnimationFrame(() => { const r = hero.getBoundingClientRect(); hero.style.setProperty("--mx", e.clientX - r.left + "px"); hero.style.setProperty("--my", e.clientY - r.top + "px"); });
    });
    tilt($(".term"), 9, hero);
  }

  // Texto que alterna digitando (edite as frases em W)
  const tp = $("#typed"), W = ["faço sites que vendem.", "crio catálogos pelo WhatsApp.", "automatizo com bots.", "transformo ideia em produto."];
  if (tp && !RM) cwReady(() => {
    let i = 0, j = 0, del = false;
    (function f() {
      const w = W[i]; tp.textContent = w.slice(0, j);
      if (!del && j === w.length) { del = true; return setTimeout(f, 1600); }
      if (del && j === 0) { del = false; i = (i + 1) % W.length; }
      j += del ? -1 : 1; setTimeout(f, del ? 28 : 55);
    })();
  });

  // Revelação ao rolar + contadores (dados reais: PROJECTS.length e chips da stack)
  $$(".rows li,.steps li,.stats div,.chips2 li").forEach((e, i) => { e.dataset.r = ""; e.style.setProperty("--d", (i % 4) * 80 + "ms"); });
  const np = $("#nproj"), nt = $("#ntech");
  if (np) np.dataset.n = typeof PROJECTS !== "undefined" ? PROJECTS.length : 0;
  if (nt) nt.dataset.n = $$(".chips2 li").length;
  const count = (el) => {
    const n = +el.dataset.n, s = el.dataset.s || "";
    if (RM || !n) { el.textContent = n + s; return; }
    const t0 = performance.now();
    (function f(t) { const p = Math.min((t - t0) / 1200, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + s; if (p < 1) requestAnimationFrame(f); })(t0);
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target); e.target.classList.add("in");
    const n = $("[data-n]", e.target); if (n) count(n);
  }), { threshold: .2 });
  $$("[data-r]").forEach((e) => io.observe(e));

  // Barra de progresso de scroll
  const pg = $("#prog"); let tk = 0;
  const up = () => { tk = 0; const m = root.scrollHeight - innerHeight; pg.style.transform = `scaleX(${m > 0 ? scrollY / m : 0})`; };
  addEventListener("scroll", () => { if (!tk) tk = requestAnimationFrame(up); }, { passive: true });

  // Cursor sutil (só com mouse)
  const cur = $("#cur");
  if (cur && FINE && !RM) {
    let x = 0, y = 0, tx = 0, ty = 0, s = 1, ts = 1;
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; cur.style.opacity = 1; ts = e.target.closest("a,button,summary,input,select,textarea") ? 2.2 : 1; }, { passive: true });
    document.addEventListener("pointerleave", () => (cur.style.opacity = 0));
    (function f() { x += (tx - x) * .18; y += (ty - y) * .18; s += (ts - s) * .18; cur.style.transform = `translate(${x}px,${y}px) scale(${s})`; requestAnimationFrame(f); })();
  }

  // Easter eggs: console estilizado e Konami code (troca o azul por lima)
  console.log("%cRafael Campos%c\nCurioso, hein? Vamos construir algo juntos:\n" + wa("Olá Rafael! Vi o console do seu site."), "font:800 24px system-ui;color:#4d8dff", "font:13px monospace");
  const K = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]; let ki = 0;
  addEventListener("keydown", (e) => {
    ki = e.key === K[ki] ? ki + 1 : e.key === K[0] ? 1 : 0;
    if (ki === K.length) { ki = 0; root.classList.toggle("k"); console.log("%c konami! modo lima", "background:#c6ff3d;color:#05070d;padding:4px 8px;font-weight:700"); }
  });

  // Menu no celular + item ativo conforme a rolagem
  const topbar = $(".top"), mb = $(".menu"), closeMenu = () => { topbar.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); mb.setAttribute("aria-label", "Abrir menu"); };
  mb.addEventListener("click", () => { const o = topbar.classList.toggle("open"); mb.setAttribute("aria-expanded", o); mb.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu"); });
  $$(".top nav a").forEach((a) => a.addEventListener("click", closeMenu));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && topbar.classList.contains("open")) { closeMenu(); mb.focus(); } });
  const links = $$('.top nav a[href^="#"]');
  const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.getAttribute("href") === "#" + e.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")); }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spy.observe(s));

  // Formulário: valida e abre o WhatsApp com a mensagem pronta
  const form = $("#form"), status = $("#status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("label", form).forEach((l) => {
      const f = $("input,select,textarea", l), msg = $("small", l);
      let m = "";
      if (!f.value.trim()) m = "Preencha este campo.";
      else if (f.name === "ideia" && f.value.trim().length < 10) m = "Descreva em pelo menos 10 caracteres.";
      msg.textContent = m; l.classList.toggle("err", !!m); f.setAttribute("aria-invalid", !!m);
      if (m) ok = false;
    });
    if (!ok) { status.textContent = "Corrija os campos destacados."; return; }
    if (!CONFIG.whatsapp) { status.textContent = "O WhatsApp ainda não foi configurado neste site."; return; }
    const d = new FormData(form);
    window.open(wa(`Olá! Sou ${d.get("nome").trim()}.\nProjeto: ${d.get("tipo")}\nPrazo: ${d.get("prazo")}\nIdeia: ${d.get("ideia").trim()}`), "_blank", "noopener");
    status.textContent = "Abrimos o WhatsApp com a sua mensagem. Falta só enviar por lá.";
  });
})();
