// ==== CONFIGURAÇÃO CENTRAL: edite aqui ====
const CONFIG = {
  whatsapp: "5521993267426", // só dígitos, com DDI e DDD
  github: "CamposEB"
};

// Imagens: salve um print de cada projeto em assets/ (WebP, ~1280px de largura).
// Se o arquivo não existir, o card mostra um placeholder com a inicial do projeto.
const PROJECTS = [
  {
    nome: "Dominique Modas",
    categoria: "Catálogo para loja",
    descricao: "Vitrine digital de moda infantil no Rio de Janeiro, com atendimento e fechamento de pedido pelo WhatsApp.",
    desafio: "Vender moda infantil mantendo o atendimento próximo pelo WhatsApp, sem a complexidade de um e-commerce tradicional.",
    solucao: "Catálogo com filtros por categoria e tamanho e lista de favoritos. O cliente escolhe as peças e chama a loja com a conversa já encaminhada.",
    tech: ["HTML", "CSS", "JavaScript", "Cloudflare"],
    imagem: "assets/dominique.webp",
    url: "https://dominique.rafaelcamposcontato7.workers.dev/"
  },
  {
    nome: "Página surpresa de aniversário",
    categoria: "Demonstração",
    descricao: "Página interativa que abre com o nome da pessoa homenageada e revela a mensagem quando ela toca no selo. Eu personalizo com nome, fotos e mensagens.",
    tech: ["HTML", "CSS", "JavaScript"],
    imagem: "assets/aniversario.webp",
    url: "https://camposeb.github.io/Presente-Anivers-rio/"
  },
  {
    nome: "Destiny Bot",
    categoria: "Bot e automação",
    descricao: "Bot para WhatsApp com comandos interativos, jogos, entretenimento, conteúdo de anime e ferramentas de administração de grupos.",
    tech: ["JavaScript", "Node.js"],
    imagem: "assets/destiny.webp",
    url: "https://github.com/CamposEB/Destiny-bot"
  }
];