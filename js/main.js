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
  // cwReady vem de intro.js; se não existir, roda na hora
  const ready = typeof cwReady === "function" ? cwReady : (fn) => fn();

  if (!CONFIG.whatsapp) console.warn("Campos Web: defina CONFIG.whatsapp em js/projects.js.");
  $$("[data-wa]").forEach((a) => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener noreferrer"; });
  $("#year").textContent = new Date().getFullYear();

  // Abre um link em nova aba de forma confiável (evita bloqueio de pop-up no celular)
  const openTab = (url) => {
    const a = h("a"); a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
    document.body.append(a); a.click(); a.remove();
  };

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

  // Projetos: grade com filtro e detalhes em janela (sem innerHTML)
  const box = $("#projects"), fbox = $("#filters"), fcount = $("#fcount"), dlg = $("#pdlg");
  const list = typeof PROJECTS !== "undefined" ? PROJECTS : [];
  const TIPOS = { site: "Sites", catalogo: "Catálogos", app: "Apps", bot: "Bots" };
  const hostOf = (u) => { try { return new URL(u).host; } catch (e) { return ""; } };
  const pad = (n) => String(n).padStart(2, "0");

  const media = (p, extra = "") => {
    const w = h("div", "media" + (p.formato === "app" ? " app" : "") + extra);
    const ph = () => h("div", "ph", p.nome.charAt(0));
    if (p.imagem) {
      const img = h("img"); img.src = p.imagem; img.alt = `Captura de tela do projeto ${p.nome}`; img.loading = "lazy"; img.decoding = "async";
      img.addEventListener("error", () => img.replaceWith(ph()));
      w.append(img);
    } else w.append(ph());
    return w;
  };
  const techList = (p) => { const ul = h("ul", "chips"); (p.tech || []).forEach((t) => ul.append(h("li", "", t))); return ul; };
  const actions = (p, onDetails) => {
    const act = h("div", "actions");
    if (p.url) act.append(ext(p.acao || "Abrir projeto", p.url, "btn sm"));
    if (onDetails) { const d = h("button", "btn ghost sm", "Detalhes"); d.type = "button"; d.addEventListener("click", () => onDetails(d)); act.append(d); }
    else {
      if (p.codigo) act.append(ext("Ver código", p.codigo, "btn ghost sm"));
      act.append(ext(p.pedido || "Quero algo parecido", wa(`Olá! Vi o projeto "${p.nome}" no seu portfólio e quero algo parecido.`), "btn ghost sm"));
    }
    return act;
  };

  // Janela de detalhes (estudo de caso)
  let last = null;
  const openDetails = (p, trigger) => {
    if (typeof dlg.showModal !== "function") { if (p.url) window.open(p.url, "_blank", "noopener"); return; }
    last = trigger;
    const x = h("button", "d-x", "×"); x.type = "button"; x.setAttribute("aria-label", "Fechar detalhes"); x.addEventListener("click", () => dlg.close());
    const body = h("div", "d-body");
    const title = h("h3", "", p.nome); title.id = "d-title";
    body.append(h("span", "tag", p.categoria), title, h("p", "d-desc", p.descricao));
    if (p.desafio || p.solucao) {
      const cols = h("div", "d-cols");
      [["Desafio", p.desafio], ["Solução", p.solucao]].forEach(([k, v]) => { if (!v) return; const bx = h("div", "d-box"); bx.append(h("b", "", k), h("p", "", v)); cols.append(bx); });
      body.append(cols);
    }
    if (p.tech && p.tech.length) body.append(techList(p));
    body.append(actions(p));
    dlg.replaceChildren(x, media(p, " wide"), body);
    dlg.setAttribute("aria-labelledby", "d-title");
    dlg.scrollTop = 0;
    dlg.showModal(); root.classList.add("lock");
  };
  dlg.addEventListener("close", () => { root.classList.remove("lock"); if (last) last.focus(); });
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

  const cards = list.map((p, i) => {
    const c = h("article", "card" + (p.destaque ? " feat" : ""));
    c.dataset.tipo = p.tipo || "";
    const tb = h("button", "thumb"); tb.type = "button"; tb.setAttribute("aria-label", `Ver detalhes: ${p.nome}`);
    tb.append(media(p), h("span", "more", "Ver detalhes"));
    tb.addEventListener("click", () => openDetails(p, tb));
    const body = h("div", "cbody");
    const meta = h("div", "meta"); meta.append(h("span", "tag", p.categoria), h("span", "idx", pad(i + 1)));
    body.append(meta, h("h3", "", p.nome), h("p", "resumo", p.resumo || p.descricao), techList(p), actions(p, (btn) => openDetails(p, btn)));
    const host = hostOf(p.url); if (host) body.insertBefore(h("p", "host", host), body.children[3]);
    c.append(tb, body); box.append(c);
    return c;
  });
  if (!cards.length) $("#projetos").hidden = true;

  // Filtros por tipo
  const tipos = Object.keys(TIPOS).filter((k) => list.some((p) => p.tipo === k));
  const say = (n) => { fcount.textContent = n === 1 ? "Mostrando 1 projeto" : `Mostrando ${n} projetos`; };
  say(list.length);
  if (tipos.length > 1) {
    const opts = [["todos", "Todos", list.length], ...tipos.map((k) => [k, TIPOS[k], list.filter((p) => p.tipo === k).length])];
    opts.forEach(([k, label, n], i) => {
      const b = h("button", "", label); b.type = "button"; b.setAttribute("aria-pressed", String(i === 0)); b.append(h("span", "", String(n)));
      b.addEventListener("click", () => {
        $$("button", fbox).forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
        let shown = 0;
        cards.forEach((c) => { const ok = k === "todos" || c.dataset.tipo === k; c.hidden = !ok; if (ok) shown++; });
        if (k === "todos") delete box.dataset.f; else box.dataset.f = k;
        say(shown);
      });
      fbox.append(b);
    });
  } else fbox.hidden = true;

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
  const tp = $("#typed"), W = ["faço sites que vendem.", "crio catálogos pelo WhatsApp.", "desenvolvo apps Android.", "automatizo com bots.", "transformo ideia em produto."];
  if (tp && !RM) ready(() => {
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
  if (np) np.dataset.n = list.length;
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
    const n = e.target.matches("[data-n]") ? e.target : $("[data-n]", e.target);
    if (n) count(n);
  }), { threshold: .2 });
  $$("[data-r]").forEach((e) => io.observe(e));

  // Barra de progresso de scroll
  const pg = $("#prog"); let tk = 0;
  const up = () => { tk = 0; const m = root.scrollHeight - innerHeight; pg.style.transform = `scaleX(${m > 0 ? scrollY / m : 0})`; };
  addEventListener("scroll", () => { if (!tk) tk = requestAnimationFrame(up); }, { passive: true });

  // Cursor sutil (só com mouse); o laço pausa quando a aba está oculta
  const cur = $("#cur");
  if (cur && FINE && !RM) {
    let x = 0, y = 0, tx = 0, ty = 0, s = 1, ts = 1;
    addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; cur.style.opacity = 1; ts = e.target.closest("a,button,summary,input,select,textarea") ? 2.2 : 1; }, { passive: true });
    document.addEventListener("pointerleave", () => (cur.style.opacity = 0));
    (function f() {
      if (!document.hidden) { x += (tx - x) * .18; y += (ty - y) * .18; s += (ts - s) * .18; cur.style.transform = `translate(${x}px,${y}px) scale(${s})`; }
      requestAnimationFrame(f);
    })();
  }

  // Easter eggs: console estilizado e Konami code (troca o azul por lima)
  console.log("%cRafael Campos%c\nCurioso, hein? Vamos construir algo juntos:\n" + wa("Olá Rafael! Vi o console do seu site."), "font:800 24px system-ui;color:#4d8dff", "font:13px monospace");
  const K = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]; let ki = 0;
  addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("input,textarea,select")) return;
    ki = e.key === K[ki] ? ki + 1 : e.key === K[0] ? 1 : 0;
    if (ki === K.length) { ki = 0; root.classList.toggle("k"); console.log("%c konami! modo lima", "background:#c6ff3d;color:#05070d;padding:4px 8px;font-weight:700"); }
  });

  // Menu no celular + item ativo conforme a rolagem
  const topbar = $(".top"), mb = $(".menu"), closeMenu = () => { topbar.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); mb.setAttribute("aria-label", "Abrir menu"); };
  mb.addEventListener("click", () => { const o = topbar.classList.toggle("open"); mb.setAttribute("aria-expanded", String(o)); mb.setAttribute("aria-label", o ? "Fechar menu" : "Abrir menu"); });
  $$(".top nav a").forEach((a) => a.addEventListener("click", closeMenu));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && topbar.classList.contains("open")) { closeMenu(); mb.focus(); } });
  const links = $$('.top nav a[href^="#"]');
  const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.getAttribute("href") === "#" + e.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")); }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach((s) => spy.observe(s));

  // Formulário: valida e abre o WhatsApp com a mensagem pronta
  const form = $("#form"), status = $("#status");
  $$("input,select,textarea", form).forEach((f) => f.addEventListener("input", () => {
    const l = f.closest("label"); l.classList.remove("err"); $("small", l).textContent = ""; f.removeAttribute("aria-invalid");
  }));
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true, first = null;
    $$("label", form).forEach((l) => {
      const f = $("input,select,textarea", l), msg = $("small", l);
      let m = "";
      if (!f.value.trim()) m = "Preencha este campo.";
      else if (f.name === "ideia" && f.value.trim().length < 10) m = "Descreva em pelo menos 10 caracteres.";
      msg.textContent = m; l.classList.toggle("err", !!m); f.setAttribute("aria-invalid", String(!!m));
      if (m) { ok = false; first = first || f; }
    });
    if (!ok) { status.textContent = "Corrija os campos destacados."; first.focus(); return; }
    if (!CONFIG.whatsapp) { status.textContent = "O WhatsApp ainda não foi configurado neste site."; return; }
    const d = new FormData(form);
    openTab(wa(`Olá! Sou ${d.get("nome").trim()}.\nProjeto: ${d.get("tipo")}\nPrazo: ${d.get("prazo")}\nIdeia: ${d.get("ideia").trim()}`));
    status.textContent = "Abrimos o WhatsApp com a sua mensagem. Falta só enviar por lá.";
  });
})();