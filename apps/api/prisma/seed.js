const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

const authors = [
  {
    name: 'Julio Silva',
    email: 'julio@codeconnect.dev',
    password: 'senha123',
  },
  {
    name: 'Bia Santos',
    email: 'bia@codeconnect.dev',
    password: 'senha123',
  },
];

const posts = [
  {
    title: 'Design systems para times front-end',
    summary:
      'Como organizar tokens, componentes e fluxos para acelerar entregas sem perder consistencia visual.',
    content:
      'Um design system vivo precisa conectar produto, engenharia e design. Neste post reunimos praticas para versionar componentes, documentar decisoes e manter acessibilidade no centro do fluxo.',
    thumbnailUrl: '/feed/img-1-desktop.png',
    tags: ['Front-end', 'React', 'Design System'],
  },
  {
    title: 'Boas praticas com autenticação JWT',
    summary:
      'Veja como proteger rotas, armazenar sessao e manter a experiencia clara para usuarios anonimos.',
    content:
      'JWT funciona melhor quando o backend valida cada acao sensivel e o frontend usa o token apenas como credencial temporaria. Tambem e importante planejar expiracao, logout e mensagens de erro.',
    thumbnailUrl: '/feed/img-2-desktop.png',
    tags: ['Back-end', 'NestJS', 'Seguranca'],
  },
  {
    title: 'Acessibilidade em cards de conteudo',
    summary:
      'Pequenos cuidados em links, botoes e contraste tornam feeds mais inclusivos e faceis de navegar.',
    content:
      'Cards precisam de hierarquia semantica, labels claros para botoes de interacao, foco visivel e conteudo legivel em telas pequenas. Isso reduz barreiras e melhora a navegacao por teclado.',
    thumbnailUrl: '/feed/img-3-desktop.png',
    tags: ['Acessibilidade', 'UI', 'Front-end'],
  },
  {
    title: 'Full-text search no PostgreSQL',
    summary:
      'Uma introducao pratica para buscar por titulo, conteudo e tags usando indices GIN.',
    content:
      'O PostgreSQL oferece busca textual nativa com tsvector, tsquery e ranking. Para feeds, uma coluna agregada com os principais campos pode ser uma solucao simples e eficiente.',
    thumbnailUrl: '/feed/img-4-desktop.png',
    tags: ['PostgreSQL', 'Back-end', 'Busca'],
  },
  {
    title: 'Quando usar placeholders de imagem',
    summary:
      'Nem todo post nasce com thumbnail. Um fallback visual evita cards quebrados e preserva a grade.',
    content:
      'Placeholders bons comunicam o tipo de conteudo, mantem proporcao e evitam saltos de layout. Eles tambem cobrem erros de carregamento e assets removidos.',
    thumbnailUrl: null,
    tags: ['UX', 'Front-end', 'Imagens'],
  },
  {
    title: 'Componentes reutilizaveis para paginas de detalhe',
    summary:
      'Feed e detalhes compartilham autor, tags, acoes e thumbnail. Reaproveitar reduz divergencias.',
    content:
      'Separar o layout da pagina dos componentes de post permite que cards compactos e detalhes completos usem a mesma fonte de dados e regras de interacao.',
    thumbnailUrl: '/feed/img-5-desktop.png',
    tags: ['React', 'Arquitetura', 'Componentes'],
  },
];

function buildSearchText(post) {
  return [post.title, post.summary, post.content, ...post.tags].join(' ');
}

async function main() {
  const createdAuthors = [];

  for (const author of authors) {
    const user = await prisma.user.upsert({
      where: { email: author.email },
      update: {},
      create: {
        name: author.name,
        email: author.email,
        passwordHash: await hash(author.password, 10),
      },
    });

    createdAuthors.push(user);
  }

  await prisma.postComment.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();

  for (const [index, post] of posts.entries()) {
    const author = createdAuthors[index % createdAuthors.length];

    const createdPost = await prisma.post.create({
      data: {
        title: post.title,
        summary: post.summary,
        content: post.content,
        thumbnailUrl: post.thumbnailUrl,
        searchText: buildSearchText(post),
        authorId: author.id,
        tags: {
          create: post.tags.map((name) => ({ name })),
        },
      },
    });

    await prisma.postLike.createMany({
      data: createdAuthors
        .filter((user) => user.id !== author.id)
        .map((user) => ({
          postId: createdPost.id,
          userId: user.id,
        })),
      skipDuplicates: true,
    });

    await prisma.postComment.create({
      data: {
        postId: createdPost.id,
        authorId: createdAuthors[(index + 1) % createdAuthors.length].id,
        content: 'Otimo conteudo para a comunidade CodeConnect.',
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
