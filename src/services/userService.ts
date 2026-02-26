import { selectUserByEmail, insertUser } from '../models/userModel.js';
import { hash, verify } from 'argon2';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';
import { sendLoginEmail, sendRegisterEmail } from './mailService.js';
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
  password?: string,
  provider?: 'LOCAL' | 'GITHUB' | 'GOOGLE'
) {
  const emailValid = validator.validate(email);

  if (emailValid === false) {
    throw new AppError('Email not compatible', 400);
  }

  if (!name) {
    throw new AppError('User field missing', 401);
  }

  const userSelect = await selectUserByEmail(email);

  if (userSelect[0]) {
    throw new AppError('Email already exists!', 409);
  }

  // Define user com valor vazio para depois mudar de acordo com as condições

  if (password) {
    const passwordValid = await checkPasswordStrength(password);
    if (passwordValid === false) {
      throw new AppError(
        `Weak password. For your security, use at least 8 characters including uppercase and lowercase letters, numbers, and symbols.`,
        400
      );
    }

    const hashedPassword = await hash(password, {
      memoryCost: 64 * 1024,
      timeCost: 2,
      parallelism: 1,
    });
    const user = await insertUser(name, email, hashedPassword, provider);

    try {
      console.log('✅ Login successful, attempting to send email...');
      await sendRegisterEmail(email, name);
      console.log('✅ Email sent successfully');
    } catch (err: any) {
      console.error('❌ Error in login flow:', err);
    }
    return user;
  } else {
    // Pra usuuários criados com OAuth
    const user = await insertUser(name, email, undefined, provider);

    try {
      console.log('✅ Login successful, attempting to send email...');
      await sendRegisterEmail(email, name);
      console.log('✅ Email sent successfully');
    } catch (err: any) {
      console.error('❌ Error in login flow:', err);
    }
    return user;
  }
}

// export async function githubUserRegister(
//   name: string,
//   email: string,
//   password: string
// ) {
//   const user = await userRegister(name, email, password);

//   return user;
// }

export async function userLogin(email: string, password: string) {
  const [user] = await selectUserByEmail(email);

  if (!user) {
    throw new AppError('Invalid credentials.', 401);
  }
  if (!user.password) {
    throw new AppError(
      `This account wasn't created in the default path. Please Login with the provider used to create this account`,
      401
    );
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

  sendLoginEmail(user.email, user.name).catch((err) =>
    console.error('Email failed', err)
  );

  return token;
}

export async function findOrCreateUser(
  provider: 'GOOGLE' | 'GITHUB',
  name: string,
  email: string
) {
  const existingUser = await selectUserByEmail(email);

  if (!existingUser || existingUser.length === 0) {
    const newUser = await userRegister(name, email, undefined, provider);
    return newUser;
  }

  return existingUser[0];
}
