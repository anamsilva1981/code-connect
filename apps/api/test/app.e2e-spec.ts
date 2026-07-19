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

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let usersById: Map<string, StoredUser>;
  let usersByEmail: Map<string, StoredUser>;

  beforeEach(async () => {
    usersById = new Map<string, StoredUser>();
    usersByEmail = new Map<string, StoredUser>();

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

  afterEach(async () => {
    await app.close();
  });
});
