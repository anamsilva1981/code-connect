import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hash } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser, StoredUser } from './user.types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<PublicUser> {
    const normalizedEmail = this.normalizeEmail(email);
    const existingUser = await this.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictException('Email ja cadastrado.');
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          passwordHash: await hash(password, 10),
        },
      });

      return this.toPublicUser(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email ja cadastrado.');
      }

      throw error;
    }
  }

  async findByEmail(email: string): Promise<StoredUser | null> {
    const normalizedEmail = this.normalizeEmail(email);
    return this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });
  }

  async findById(id: string): Promise<StoredUser | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  toPublicUser(user: StoredUser): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
