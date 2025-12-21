import { selectUserByEmail, insertUser } from '../models/userModel.ts';
import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.ts';
import { sendEmail } from './mailService.ts';

export async function userRegister(
  name: string,
  email: string,
  password: string
) {
  const userSelect = await selectUserByEmail(email);
  if (!name) {
    throw new AppError('User field missing', 401);
  }

  if (userSelect[0]) {
    throw new AppError('Email already exists!', 409);
  }

  const hashedPassword = await hash(password);

  const user = await insertUser(name, email, hashedPassword);

  return user;
}

export async function userLogin(email: string, password: string) {
  const userSelect = await selectUserByEmail(email);

  const userName = userSelect[0].name;

  if (userSelect.length === 0) {
    throw new AppError('Invalid credentials.', 401);
  }

  const user = userSelect[0];

  const matchPassword = await verify(user.password, password);

  if (!matchPassword) {
    throw new AppError('Invalid credentials.', 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error(`JWT_SECRET MUST BE SET.`);
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);
  sendEmail(email, userName); //sometime i fix that
  return token;
}
