import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { StoredUser } from './user.types';

type CreateUserArgs = {
  data: {
    name: string;
    email: string;
    passwordHash: string;
  };
};

type FindUniqueUserArgs = {
  where:
    | {
        email: string;
      }
    | {
        id: string;
      };
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findUnique: jest.Mock<Promise<StoredUser | null>, [FindUniqueUserArgs]>;
      create: jest.Mock<Promise<StoredUser>, [CreateUserArgs]>;
    };
  };

  const storedUser: StoredUser = {
    id: 'user-id',
    name: 'Ada Lovelace',
    email: 'ada@codeconnect.dev',
    passwordHash: 'hashed-password',
  };

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn<Promise<StoredUser | null>, [FindUniqueUserArgs]>(),
        create: jest.fn<Promise<StoredUser>, [CreateUserArgs]>(),
      },
    };
    service = new UsersService(prisma as unknown as PrismaService);
  });

  it('creates a public user without the password hash', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(storedUser);

    const user = await service.create(
      'Ada Lovelace',
      'ADA@CodeConnect.dev',
      'senha123',
    );

    const createArgs = prisma.user.create.mock.calls[0][0];

    expect(createArgs.data).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
    });
    expect(typeof createArgs.data.passwordHash).toBe('string');
    expect(user).toEqual({
      id: 'user-id',
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
    });
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('normalizes email before searching and creating', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(storedUser);

    await service.create('Ada Lovelace', ' ADA@CodeConnect.dev ', 'senha123');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'ada@codeconnect.dev',
      },
    });
    const createArgs = prisma.user.create.mock.calls[0][0];

    expect(createArgs.data).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
    });
    expect(typeof createArgs.data.passwordHash).toBe('string');
  });

  it('rejects duplicate emails', async () => {
    prisma.user.findUnique.mockResolvedValue(storedUser);

    await expect(
      service.create('Grace Hopper', 'ADA@CodeConnect.dev', 'senha456'),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('finds users by normalized email', async () => {
    prisma.user.findUnique.mockResolvedValue(storedUser);

    await expect(service.findByEmail(' ADA@CodeConnect.dev ')).resolves.toEqual(
      storedUser,
    );
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'ada@codeconnect.dev',
      },
    });
  });

  it('finds users by id', async () => {
    prisma.user.findUnique.mockResolvedValue(storedUser);

    await expect(service.findById('user-id')).resolves.toEqual(storedUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'user-id',
      },
    });
  });
});
