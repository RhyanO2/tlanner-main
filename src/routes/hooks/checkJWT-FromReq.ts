import type { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

type JWTPayload = {
  sub: string;
};

export async function checkRequestJWT(req: FastifyRequest, res: FastifyReply) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send();
  }
  if (!process.env.JWT_SECRET) {
    throw new Error(`JWT_SECRET MUST BE SET.`);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

    console.log(payload);
  } catch (err) {
    return res.status(401).send();
  }
}
