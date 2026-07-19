import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PublicUser, StoredUser } from '../users/user.types';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: {
    create: jest.Mock<Promise<PublicUser>, [string, string, string]>;
    findByEmail: jest.Mock<Promise<StoredUser | null>, [string]>;
    toPublicUser: jest.Mock<PublicUser, [StoredUser]>;
  };

  beforeEach(() => {
    usersService = {
      create: jest.fn<Promise<PublicUser>, [string, string, string]>(),
      findByEmail: jest.fn<Promise<StoredUser | null>, [string]>(),
      toPublicUser: jest.fn<PublicUser, [StoredUser]>(),
    };

    authService = new AuthService(
      usersService as unknown as UsersService,
      new JwtService({
        secret: 'test-secret',
        signOptions: { expiresIn: '1h' },
      }),
    );
  });

  it('registers a public user without the password hash', async () => {
    const publicUser: PublicUser = {
      id: 'user-id',
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
    };
    usersService.create.mockResolvedValue(publicUser);

    const user = await authService.register(
      'Ada Lovelace',
      'ADA@CodeConnect.dev',
      'senha123',
    );

    expect(usersService.create).toHaveBeenCalledWith(
      'Ada Lovelace',
      'ADA@CodeConnect.dev',
      'senha123',
    );
    expect(user).toEqual(publicUser);
    expect(user).not.toHaveProperty('passwordHash');
  });

  it('rejects duplicate emails', async () => {
    usersService.create.mockRejectedValue(
      new ConflictException('Email ja cadastrado.'),
    );

    await expect(
      authService.register('Grace Hopper', 'ADA@CodeConnect.dev', 'senha456'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with valid credentials', async () => {
    const storedUser: StoredUser = {
      id: 'user-id',
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
      passwordHash: await hash('senha123', 10),
    };
    const publicUser: PublicUser = {
      id: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
    };
    usersService.findByEmail.mockResolvedValue(storedUser);
    usersService.toPublicUser.mockReturnValue(publicUser);

    const response = await authService.login('ada@codeconnect.dev', 'senha123');

    expect(usersService.findByEmail).toHaveBeenCalledWith(
      'ada@codeconnect.dev',
    );
    expect(response).toEqual({
      accessToken: response.accessToken,
      user: publicUser,
    });
    expect(typeof response.accessToken).toBe('string');
  });

  it('rejects invalid credentials', async () => {
    usersService.findByEmail.mockResolvedValue({
      id: 'user-id',
      name: 'Ada Lovelace',
      email: 'ada@codeconnect.dev',
      passwordHash: await hash('senha123', 10),
    });

    await expect(
      authService.login('ada@codeconnect.dev', 'senha000'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
