import {
  findOrCreateUser,
  userLogin,
  userRegister,
} from '../services/userService';
import { type FastifyRequest, type FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export async function register(req: FastifyRequest, res: FastifyReply) {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const user = await userRegister(name, email, password);

    res.status(201).send({ User: user.id });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function login(req: FastifyRequest, res: FastifyReply) {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };
    const result = await userLogin(email, password);

    res.status(200).send({
      message: 'Acess granted!',
      token: result,
    });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function githubAuth(req: FastifyRequest, res: FastifyReply) {
  try {
    const { code } = req.query as { code: string };

    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('❌ [ERRO] Erro no token:', tokenData);
      return res.status(400).send({ error: tokenData.error_description });
    }

    const { access_token } = tokenData;

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (userData.message) {
      console.error('❌ [ERRO] Erro ao buscar usuário:', userData.message);
      return res.status(401).send({
        error: userData.message,
      });
    }
    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    });

    const emails = await emailsRes.json();

    const primaryEmail = emails.find(
      (email: any) => email.primary && email.verified
    )?.email;

    if (!primaryEmail) {
      console.error('❌ [ERRO] Nenhum email verificado encontrado');
      return res.status(400).send({
        error: 'GitHub account has no verified email',
      });
    }

    const user = await findOrCreateUser(
      'GITHUB',
      userData.name || userData.login,
      primaryEmail
    );

    if (!process.env.JWT_SECRET) {
      console.error('❌ [ERRO] JWT_SECRET não configurado');
      throw new Error('JWT_SECRET MUST BE SET.');
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 'http://localhost:3000/api/auth/callback/github'
    const redirectUrl = `http://www.tlanner.vercel.app/dashboard/${user.id}?token=${token}`;

    return res.redirect(redirectUrl);
  } catch (err: any) {
    console.error('❌ [ERRO FATAL] Erro no GitHub OAuth:', {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode,
    });
    return res.status(err.statusCode || 500).send({
      message: err.message || 'GitHub authentication failed',
    });
  }
}
