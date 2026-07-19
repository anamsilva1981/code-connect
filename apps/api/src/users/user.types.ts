export type PublicUser = {
  id: string;
  name: string;
  email: string;
};

export type StoredUser = PublicUser & {
  passwordHash: string;
};
