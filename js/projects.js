// ==== CONFIGURAÇÃO CENTRAL: edite aqui ====
const CONFIG = {
  whatsapp: "5521993267426",            // Só dígitos com DDI e DDD. Ex.: "5521999999999"
  github: "CamposEB"
};

// Projetos em destaque (lista local, usada também se a API do GitHub falhar).
// "repo" deve ser o nome exato do repositório no GitHub.
const FEATURED = [
  {
    repo: "Destiny-bot",
    nome: "Destiny Bot",
    categoria: "Bot / Automação",
    descricao: "Um bot para WhatsApp que reúne comandos interativos, jogos, recursos de entretenimento, conteúdos de anime e ferramentas de administração de grupos.",
    tech: ["JavaScript", "Node.js"],
    destaques: [],
    status: "",
    url: "https://github.com/CamposEB/Destiny-bot"
  },
  {
    nome: "Sites personalizados",
    categoria: "Projetos sob medida",
    descricao: "Experiências digitais criadas sob medida para celebrar momentos especiais, divulgar negócios e apresentar ideias de forma criativa.",
    tech: [],
    destaques: ["Sites de aniversário", "Pedidos de namoro", "Convites de casamento", "Landing pages para pequenos negócios"],
    status: "",
    interno: "#demos"
  }
];

// Demonstrações. Para publicar uma, preencha "url" (ou adicione um novo item).
const DEMOS = [
  { titulo: "Aniversário", descricao: "Página comemorativa com fotos, mensagens e animações.", url: "https://camposeb.github.io/Presente-Anivers-rio/" },
  { titulo: "Pedido de namoro", descricao: "Experiência interativa com estética romântica.", url: "" },
  { titulo: "Convite de casamento", descricao: "Página elegante com as informações do evento.", url: "" }
];