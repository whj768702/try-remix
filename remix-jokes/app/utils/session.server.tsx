import bcrypt from 'bcrypt';
import { db } from './db.server';

type LoginForm = {
  username: string;
  password: string;
};

export async function login({ username, password }: LoginForm) {
  let user = await db.user.findUnique({
    where: { username },
  });
  if (!user) {
    return null;
  }

  let isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return null;
  }
  return user;
}
