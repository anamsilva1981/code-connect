import { Request } from 'express';
import { PublicUser } from '../users/user.types';

export type JwtPayload = {
  sub: string;
  email: string;
};

export type AuthenticatedRequest = Request & {
  user: PublicUser;
};
