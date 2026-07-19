import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { randomUUID } from 'node:crypto';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

type PublicUserResponse = {
  id: string;
  name: string;
  email: string;
};

type LoginResponse = {
  accessToken: string;
  user: PublicUserResponse;
};

type StoredUser = PublicUserResponse & {
  passwordHash: string;
};

type StoredComment = {
  id: string;
  authorId: string;
  content: string;
  createdAt: Date;
};

type StoredPost = {
  id: string;
  title: string;
  summary: string;
  content: string;
  thumbnailUrl: string | null;
  authorId: string;
  tags: string[];
  likes: Set<string>;
  comments: StoredComment[];
  createdAt: Date;
  updatedAt: Date;
};

type PostIncludeArgs = {
  include?: {
    likes?: {
      where?: {
        userId?: string;
      };
    };
    comments?: {
      take?: number;
    };
  };
};

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let usersById: Map<string, StoredUser>;
  let usersByEmail: Map<string, StoredUser>;
  let postsById: Map<string, StoredPost>;

  const toPostRecord = (post: StoredPost, args?: PostIncludeArgs) => {
    const author = usersById.get(post.authorId) as StoredUser;
    const likedUserId = args?.include?.likes?.where?.userId;
    const comments =
      args?.include?.comments?.take === 0
        ? []
        : post.comments.map((comment) => {
            const commentAuthor = usersById.get(comment.authorId) as StoredUser;

            return {
              id: comment.id,
              content: comment.content,
              createdAt: comment.createdAt,
              author: commentAuthor,
            };
          });

    return {
      id: post.id,
      title: post.title,
      summary: post.summary,
      content: post.content,
      thumbnailUrl: post.thumbnailUrl,
      author,
      tags: post.tags.map((name) => ({ name })),
      likes:
        likedUserId && post.likes.has(likedUserId)
          ? [{ id: `${post.id}-${likedUserId}` }]
          : [],
      comments,
      _count: {
        likes: post.likes.size,
        comments: post.comments.length,
      },
      createdAt: post.createdAt,
    };
  };

  beforeEach(async () => {
    usersById = new Map<string, StoredUser>();
    usersByEmail = new Map<string, StoredUser>();
    postsById = new Map<string, StoredPost>();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          findUnique: ({
            where,
          }: {
            where: { id?: string; email?: string };
          }) => {
            if (where.id) {
              return Promise.resolve(usersById.get(where.id) ?? null);
            }

            if (where.email) {
              return Promise.resolve(usersByEmail.get(where.email) ?? null);
            }

            return Promise.resolve(null);
          },
          create: ({
            data,
          }: {
            data: { name: string; email: string; passwordHash: string };
          }) => {
            const user: StoredUser = {
              id: randomUUID(),
              name: data.name,
              email: data.email,
              passwordHash: data.passwordHash,
            };

            usersById.set(user.id, user);
            usersByEmail.set(user.email, user);

            return Promise.resolve(user);
          },
        },
        $queryRaw: () =>
          Promise.resolve(
            Array.from(postsById.values()).map((post) => ({ id: post.id })),
          ),
        post: {
          findMany: (args: PostIncludeArgs) =>
            Promise.resolve(
              Array.from(postsById.values()).map((post) =>
                toPostRecord(post, args),
              ),
            ),
          findUnique: ({
            where,
            select,
            ...args
          }: PostIncludeArgs & {
            where: { id: string };
            select?: { id?: boolean };
          }) => {
            const post = postsById.get(where.id);

            if (!post) {
              return Promise.resolve(null);
            }

            if (select?.id) {
              return Promise.resolve({ id: post.id });
            }

            return Promise.resolve(toPostRecord(post, args));
          },
          create: ({
            data,
          }: {
            data: {
              title: string;
              summary: string;
              content: string;
              thumbnailUrl?: string | null;
              authorId: string;
              tags: { create: Array<{ name: string }> };
            };
          }) => {
            const now = new Date();
            const post: StoredPost = {
              id: randomUUID(),
              title: data.title,
              summary: data.summary,
              content: data.content,
              thumbnailUrl: data.thumbnailUrl ?? null,
              authorId: data.authorId,
              tags: data.tags.create.map((tag) => tag.name),
              likes: new Set<string>(),
              comments: [],
              createdAt: now,
              updatedAt: now,
            };

            postsById.set(post.id, post);

            return Promise.resolve(toPostRecord(post));
          },
        },
        postComment: {
          create: ({
            data,
          }: {
            data: { postId: string; authorId: string; content: string };
          }) => {
            const post = postsById.get(data.postId);

            if (post) {
              post.comments.push({
                id: randomUUID(),
                authorId: data.authorId,
                content: data.content,
                createdAt: new Date(),
              });
            }

            return Promise.resolve({});
          },
        },
        postLike: {
          createMany: ({
            data,
          }: {
            data: Array<{ postId: string; userId: string }>;
          }) => {
            for (const like of data) {
              postsById.get(like.postId)?.likes.add(like.userId);
            }

            return Promise.resolve({ count: data.length });
          },
          deleteMany: ({
            where,
          }: {
            where: { postId: string; userId: string };
          }) => {
            postsById.get(where.postId)?.likes.delete(where.userId);

            return Promise.resolve({ count: 1 });
          },
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect({
      status: 'ok',
      name: 'Code Connect API',
    });
  });

  it('/auth/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Ada Lovelace',
        email: 'ADA@CodeConnect.dev',
        password: 'senha123',
      })
      .expect(201);
    const body = response.body as PublicUserResponse;

    expect(body).toEqual({
      id: body.id,
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
    });
    expect(typeof body.id).toBe('string');
    expect(body).not.toHaveProperty('passwordHash');
  });

  it('/auth/register (POST) rejects duplicate email', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Grace Hopper',
        email: 'ADA@CodeConnect.dev',
        password: 'senha456',
      })
      .expect(409);
  });

  it('/auth/login (POST)', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'ada@codeconnect.dev',
        password: 'senha123',
      })
      .expect(200);
    const body = response.body as LoginResponse;

    expect(body).toEqual({
      accessToken: body.accessToken,
      user: {
        id: body.user.id,
        name: 'Ada Lovelace',
        email: 'ada@codeconnect.dev',
      },
    });
    expect(typeof body.accessToken).toBe('string');
    expect(typeof body.user.id).toBe('string');
  });

  it('/auth/login (POST) rejects invalid credentials', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'ada@codeconnect.dev',
        password: 'senha000',
      })
      .expect(401);
  });

  it('/auth/me (GET) rejects requests without a token', () => {
    return request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('/auth/me (GET) returns the authenticated user', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'ada@codeconnect.dev',
        password: 'senha123',
      });
    const loginBody = loginResponse.body as LoginResponse;

    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .expect(200);
    const body = response.body as PublicUserResponse;

    expect(body).toEqual(loginBody.user);
  });

  it('/posts (GET) returns public posts', async () => {
    const userResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Ada Lovelace',
        email: 'ada@codeconnect.dev',
        password: 'senha123',
      });
    const user = userResponse.body as PublicUserResponse;

    postsById.set('post-id', {
      id: 'post-id',
      title: 'Full-text search no PostgreSQL',
      summary: 'Busca no backend',
      content: 'Conteudo',
      thumbnailUrl: null,
      authorId: user.id,
      tags: ['PostgreSQL'],
      likes: new Set<string>(),
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app.getHttpServer())
      .get('/posts')
      .expect(200);

    expect(response.body).toEqual([
      expect.objectContaining({
        id: 'post-id',
        title: 'Full-text search no PostgreSQL',
        likedByMe: false,
      }),
    ]);
  });

  it('/posts (POST) requires authentication', () => {
    return request(app.getHttpServer()).post('/posts').send({}).expect(401);
  });

  it('/posts supports authenticated creation, likes and comments', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
      password: 'senha123',
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'ada@codeconnect.dev',
        password: 'senha123',
      });
    const loginBody = loginResponse.body as LoginResponse;

    const createResponse = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .send({
        title: 'Novo post',
        summary: 'Resumo',
        content: 'Conteudo',
        tags: ['React'],
      })
      .expect(201);
    const post = createResponse.body as { id: string };

    const likedResponse = await request(app.getHttpServer())
      .post(`/posts/${post.id}/likes`)
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .expect(201);

    expect(likedResponse.body).toMatchObject({
      likedByMe: true,
      likesCount: 1,
    });

    const commentedResponse = await request(app.getHttpServer())
      .post(`/posts/${post.id}/comments`)
      .set('Authorization', `Bearer ${loginBody.accessToken}`)
      .send({ content: 'Muito bom.' })
      .expect(201);

    expect(commentedResponse.body).toMatchObject({
      commentsCount: 1,
      comments: [expect.objectContaining({ content: 'Muito bom.' })],
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
