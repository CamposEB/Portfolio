/* Terminal interativo do hero. Lê CONFIG e PROJECTS de projects.js. Saída sempre via textContent. */
(() => {
  const out = document.getElementById("tout"), form = document.getElementById("tform"), inp = document.getElementById("tin");
  if (!out) return;
  const wa = (m) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(m)}`;
  const down = () => (out.scrollTop = out.scrollHeight);
  const P = (t, c) => { const d = document.createElement("div"); if (c) d.className = c; d.textContent = t; out.append(d); down(); };
  const L = (t, href) => { const d = document.createElement("div"), a = document.createElement("a"); a.textContent = t; a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer"; d.append(a); out.append(d); down(); };

  const C = {
    ajuda() {
      P("comandos disponíveis:", "h");
      [["projetos", "meus trabalhos no ar"], ["servicos", "o que eu faço"], ["stack", "tecnologias que uso"], ["sobre", "quem sou eu"], ["contato", "falar comigo no WhatsApp"], ["preco", "quanto custa"], ["perf", "medidas reais desta página"], ["neofetch", "ficha técnica do site"], ["limpar", "limpa a tela"]].forEach(([a, b]) => P("  " + a.padEnd(10) + b));
    },
    projetos() {
      (typeof PROJECTS !== "undefined" ? PROJECTS : []).forEach((p) => { P(`▸ ${p.nome} (${p.categoria})`, "h"); if (p.url) L("  " + p.url, p.url); });
    },
    servicos() { ["sites e landing pages", "catálogos com pedido pelo WhatsApp", "aplicações web sob medida", "bots e automações"].forEach((s) => P("▸ " + s)); },
    stack() { P("HTML · CSS · JavaScript · Node.js · Cloudflare · WhatsApp"); },
    sobre() { P("Rafael Campos, desenvolvedor web."); P("Sites, catálogos, apps e bots sob medida, em HTML, CSS e JS puros. Você recebe o valor antes de eu começar."); },
    contato() {
      P("Conte a ideia e receba o valor antes de começar.");
      L("→ abrir WhatsApp", wa("Olá! Vim pelo terminal do seu site e quero um orçamento."));
      L("→ github.com/" + CONFIG.github, "https://github.com/" + CONFIG.github);
    },
    preco() { P("Cada projeto tem escopo próprio. Conte a ideia e receba o valor antes de eu começar."); L("→ pedir valor no WhatsApp", wa("Olá! Quero saber o valor de um projeto.")); },
    neofetch() { P("rafael@campos-web", "h"); [["hospedagem", "GitHub Pages"], ["stack", "HTML · CSS · JS"], ["framework", "nenhum"], ["build", "nenhum"], ["mensalidade", "R$ 0"]].forEach(([a, b]) => P(a.padEnd(12) + ": " + b)); },
    perf() {
      const n = performance.getEntriesByType("navigation")[0];
      if (!n || location.protocol === "file:") return P("Abra o site publicado para medir.", "e");
      const r = performance.getEntriesByType("resource").filter((e) => new URL(e.name).origin === location.origin);
      const kb = Math.round((n.transferSize + r.reduce((a, e) => a + e.transferSize, 0)) / 1024);
      P("DOM pronto : " + Math.round(n.domContentLoadedEventEnd) + " ms");
      P("carregado  : " + Math.round(n.loadEventEnd) + " ms");
      P("arquivos   : " + (r.length + 1) + " (~" + kb + " KB do próprio site)");
    },
    limpar() { out.textContent = ""; },
  };
  const alias = { help: "ajuda", ls: "projetos", clear: "limpar", whoami: "sobre", orcamento: "contato", contratar: "contato", "preço": "preco", valor: "preco" };
  const hist = []; let hi = 0;

  function run(raw) {
    const v = raw.trim().toLowerCase(); if (!v) return;
    hist.push(v); hi = hist.length;
    P("$ " + v, "u");
    const k = alias[v] || v;
    if (k === "sudo" || k.startsWith("sudo ")) return P("boa tentativa. Aqui quem manda é o cliente.");
    C[k] ? C[k]() : P(`comando não encontrado: ${v}. Digite ajuda.`, "e");
  }

  form.addEventListener("submit", (e) => { e.preventDefault(); run(inp.value); inp.value = ""; });
  inp.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hist.length) { e.preventDefault(); hi = Math.max(0, hi - 1); inp.value = hist[hi]; }
    else if (e.key === "ArrowDown" && hist.length) { e.preventDefault(); hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ""; }
    else if (e.key === "Tab" && inp.value) { const m = Object.keys(C).find((c) => c.startsWith(inp.value.toLowerCase())); if (m) { e.preventDefault(); inp.value = m; } }
  });
  document.querySelectorAll("[data-cmd]").forEach((b) => b.addEventListener("click", () => run(b.dataset.cmd)));

  cwReady(() => { P("Rafael Campos · terminal v1.0", "h"); P('Digite "ajuda" ou toque em um comando abaixo.'); });
})();
