(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt !== undefined) e.textContent = txt; return e; };
  const ext = (txt, href, cls) => { const a = h("a", cls, txt); a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer"; return a; };
  const wa = (msg) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

  if (!CONFIG.whatsapp) console.warn("Campos Web: defina CONFIG.whatsapp em js/projects.js.");
  $$("[data-wa]").forEach((a) => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener noreferrer"; });
  $("#year").textContent = new Date().getFullYear();

  // Projetos: os destaques + demonstrações que já têm link publicado
  const list = [...(typeof FEATURED !== "undefined" ? FEATURED : [])];
  (typeof DEMOS !== "undefined" ? DEMOS : []).filter((d) => d.url).forEach((d) =>
    list.push({ nome: d.titulo, categoria: "Demonstração", descricao: d.descricao, tech: [], destaques: [], demo: d.url })
  );

  const box = $("#projects");
  list.forEach((p) => {
    const c = h("article", "card");
    if (p.categoria) c.append(h("span", "tag", p.categoria));
    c.append(h("h3", "", p.nome), h("p", "", p.descricao));
    const chips = [...(p.tech || []), ...(p.destaques || [])];
    if (chips.length) { const ul = h("ul", "chips"); chips.forEach((t) => ul.append(h("li", "", t))); c.append(ul); }
    const act = h("div", "actions");
    if (p.url) act.append(ext("Ver projeto", p.url, "btn primary sm"));
    if (p.demo) act.append(ext("Acessar demonstração", p.demo, "btn ghost sm"));
    if (act.children.length) c.append(act);
    box.append(c);
  });
  if (!list.length) $("#projetos").hidden = true;

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
    const msg = `Olá! Sou ${d.get("nome").trim()}.\nProjeto: ${d.get("tipo")}\nIdeia: ${d.get("ideia").trim()}`;
    window.open(wa(msg), "_blank", "noopener");
    status.textContent = "Abrimos o WhatsApp com a sua mensagem. Falta só enviar por lá.";
  });
})();