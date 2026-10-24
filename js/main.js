(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };
  const ext = (txt, href, cls) => { const a = h("a", cls, txt); a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer"; return a; };
  const wa = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  const labeled = (label, text) => { const p = h("p"); p.append(h("strong", "", label + " "), document.createTextNode(text)); return p; };

  if (!CONFIG.whatsapp) console.warn("Campos Web: defina CONFIG.whatsapp em js/projects.js.");
  $$("[data-wa]").forEach((a) => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener noreferrer"; });
  $("#year").textContent = new Date().getFullYear();

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

    const frame = h("div", "frame");
    const bar = h("div", "fbar");
    let host = ""; try { host = new URL(p.url).host; } catch (e) {}
    bar.append(h("i"), h("i"), h("i"), h("span", "", host));
    const ph = () => h("div", "ph", p.nome.charAt(0));
    frame.append(bar);
    if (p.imagem) {
      const img = h("img"); img.src = p.imagem; img.alt = `Captura de tela do projeto ${p.nome}`; img.loading = "lazy";
      img.addEventListener("error", () => img.replaceWith(ph()));
      frame.append(img);
    } else frame.append(ph());

    c.append(info, frame);
    box.append(c);
  });
  if (!box.children.length) $("#projetos").hidden = true;

  // Luz que acompanha o mouse no hero (só em telas com mouse e sem redução de movimento)
  const hero = $(".hero");
  if (hero && matchMedia("(hover:hover) and (prefers-reduced-motion:no-preference)").matches) {
    let f;
    hero.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(f);
      f = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", e.clientX - r.left + "px");
        hero.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

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
    window.open(wa(`Olá! Sou ${d.get("nome").trim()}.\nProjeto: ${d.get("tipo")}\nIdeia: ${d.get("ideia").trim()}`), "_blank", "noopener");
    status.textContent = "Abrimos o WhatsApp com a sua mensagem. Falta só enviar por lá.";
  });
})();