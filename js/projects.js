// ==== CONFIGURAÇÃO CENTRAL: edite aqui ====
const CONFIG = {
  whatsapp: "5521993267426", // só dígitos, com DDI e DDD
  github: "CamposEB"
};

// Campos de cada projeto:
//   nome, categoria, descricao  (obrigatórios)
//   tipo                        ("site", "catalogo", "app" ou "bot": define o filtro)
//   resumo                      (1 frase curta para o card; a descricao completa vai nos detalhes)
//   destaque: true              (card largo, em evidência; use em 1 projeto)
//   desafio, solucao            (opcionais; aparecem nos detalhes)
//   tech                        (lista de tecnologias)
//   imagem                      (print em assets/, WebP ~1280px; sem arquivo, aparece a inicial)
//   url, acao                   (link principal e texto do botão; padrão "Abrir projeto")
//   codigo                      (link do código-fonte; mostra "Ver código")
//   pedido                      (texto do botão de orçamento; padrão "Quero algo parecido")
//   formato: "app"              (a imagem não é cortada)
const PROJECTS = [
  {
    nome: "Solar Viva Viva",
    tipo: "site",
    destaque: true,
    categoria: "Site com Painel Administrativo",
    resumo: "Site para casa de festas com CMS próprio para gerenciar conteúdos, fotos, textos e temas sazonais.",
    descricao: "Site institucional para um castelo de festas em São Gonçalo. Inclui galeria dinâmica, comunicados, letreiro animado, promoções e um painel administrativo completo (CMS) para a proprietária atualizar o site sem precisar de programador.",
    desafio: "Criar uma presença online elegante que destacasse a arquitetura única (um castelo) e permitisse que a proprietária gerenciasse todo o conteúdo sozinha, sem custos mensais altos de plataformas de CMS prontas.",
    solucao: "Desenvolvimento de um site estático de alta performance na Cloudflare Pages, integrado com Workers, banco D1 e R2 para criar um CMS personalizado. Inclui troca de temas visuais (Natal, Ano Novo), galeria gerenciável e painel administrativo seguro.",
    tech: ["HTML", "CSS", "JavaScript", "Cloudflare Pages", "Cloudflare D1", "Cloudflare R2", "Cloudflare Workers"],
    imagem: "assets/solar-viva-viva.webp",
    url: "https://solarvivaviva.com.br",
    acao: "Visitar o site",
    pedido: "Quero um site com painel próprio"
  },
  {
    nome: "Destiny: baixador de vídeos e áudios",
    tipo: "app",
    categoria: "App Android",
    formato: "app",
    resumo: "App Android gratuito e de código aberto para baixar vídeos e áudios de mais de 1000 sites.",
    descricao: "Aplicativo Android gratuito e de código aberto para baixar vídeo ou só o áudio (MP3 ou M4A) de mais de 1000 sites, com o motor yt-dlp. Sem anúncios, sem conta e sem rastreamento. Use apenas para conteúdo que você tem direito de baixar.",
    desafio: "Entregar uma experiência simples (colar o link e baixar) sobre um motor poderoso, mantendo tudo privado, dentro do aparelho.",
    solucao: "Construído sobre o Seal, com visual próprio em Jetpack Compose, tema escuro, atualização dentro do app e um site de download com o APK para cada arquitetura.",
    tech: ["Kotlin", "Jetpack Compose", "yt-dlp", "Android 7.0+"],
    imagem: "assets/destiny-app.webp",
    url: "https://destiny.rafaelcamposcontato7.workers.dev/",
    acao: "Baixar o app",
    codigo: "https://github.com/CamposEB/app-downloader",
    pedido: "Quero um app parecido"
  },
  {
    nome: "Dominique Modas",
    tipo: "catalogo",
    categoria: "Catálogo para loja",
    resumo: "Catálogo de moda infantil com filtros, favoritos e pedido direto pelo WhatsApp.",
    descricao: "Vitrine digital de moda infantil no Rio de Janeiro, com atendimento e fechamento de pedido pelo WhatsApp.",
    desafio: "Vender moda infantil mantendo o atendimento próximo pelo WhatsApp, sem a complexidade de um e-commerce tradicional.",
    solucao: "Catálogo com filtros por categoria e tamanho e lista de favoritos. O cliente escolhe as peças e chama a loja com a conversa já encaminhada.",
    tech: ["HTML", "CSS", "JavaScript", "Cloudflare"],
    imagem: "assets/dominique.webp",
    url: "https://dominique.rafaelcamposcontato7.workers.dev/",
    pedido: "Quero um catálogo parecido"
  },
  {
    nome: "Página surpresa de aniversário",
    tipo: "site",
    categoria: "Demonstração",
    resumo: "Página interativa de aniversário, personalizada com nome, fotos e mensagens.",
    descricao: "Página interativa que abre com o nome da pessoa homenageada e revela a mensagem quando ela toca no selo. Eu personalizo com nome, fotos e mensagens.",
    tech: ["HTML", "CSS", "JavaScript"],
    imagem: "assets/aniversario.webp",
    url: "https://camposeb.github.io/Presente-Anivers-rio/",
    pedido: "Quero uma página surpresa"
  },
  {
    nome: "Destiny Bot",
    tipo: "bot",
    categoria: "Bot e automação",
    resumo: "Bot de WhatsApp com comandos interativos, jogos e ferramentas de administração de grupos.",
    descricao: "Bot para WhatsApp com comandos interativos, jogos, entretenimento, conteúdo de anime e ferramentas de administração de grupos.",
    tech: ["JavaScript", "Node.js"],
    imagem: "assets/destiny.webp",
    url: "https://github.com/CamposEB/Destiny-bot",
    acao: "Ver no GitHub",
    pedido: "Quero um bot parecido"
  }
];