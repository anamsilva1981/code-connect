import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { PublicUser } from '../users/user.types';
import { JwtPayload } from './auth.types';

export type LoginResponse = {
  accessToken: string;
  user: PublicUser;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<PublicUser> {
    return this.usersService.create(name, email, password);
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const publicUser = this.usersService.toPublicUser(user);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: publicUser,
    };
  }

  getProfile(user: PublicUser): PublicUser {
    return user;
  }
}
