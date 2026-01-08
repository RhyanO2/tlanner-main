import { selectUserByEmail, insertUser } from '../models/userModel.js';
import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';
import { sendEmail } from './mailService.js';
import * as validator from 'email-validator';

async function checkPasswordStrength(password: string) {
  if (password.length < 8) {
    return false;
  }

  const lowerCase = /[a-z]/;
  if (!lowerCase.test(password)) {
    return false;
  }

  const upperCase = /[A-Z]/;
  if (!upperCase.test(password)) {
    return false;
  }

  const number = /[0-9]/;
  if (!number.test(password)) {
    return false;
  }

  const specialChar = /[!@#$%^&*()_+{}:"<>?|[\],.;\/\-]/;
  if (!specialChar.test(password)) {
    return false;
  }

  return true;
}

export async function userRegister(
  name: string,
  email: string,
  password: string
) {
  const emailValid = validator.validate(email);

  if (emailValid === false) {
    throw new AppError('Email not compatible', 400);
  }

  const userSelect = await selectUserByEmail(email);
  if (!name) {
    throw new AppError('User field missing', 401);
  }

  if (userSelect[0]) {
    throw new AppError('Email already exists!', 409);
  }
  const passwordValid = await checkPasswordStrength(password);
  if (passwordValid === false) {
    throw new AppError(
      `Weak password. For your security, use at least 8 characters including uppercase and lowercase letters, numbers, and symbols.`,
      400
    );
  }

  const hashedPassword = await hash(password);

  const user = await insertUser(name, email, hashedPassword);

  return user;
}

export async function userLogin(email: string, password: string) {
  const userSelect = await selectUserByEmail(email);

  if (userSelect.length === 0) {
    throw new AppError('Invalid credentials.', 401);
  }

  const user = userSelect[0];
  const name = user.name;

  try {
    console.log('✅ Login successful, attempting to send email...');
    await sendEmail(user.email, user.name);
    console.log('✅ Email sent successfully');
  } catch (err: any) {
    console.error('❌ Error in login flow:', err);
  }

  const matchPassword = await verify(user.password, password);

  if (!matchPassword) {
    throw new AppError('Invalid credentials.', 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error(`JWT_SECRET MUST BE SET.`);
  }

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  sendEmail(email, name);
  return token;
}
