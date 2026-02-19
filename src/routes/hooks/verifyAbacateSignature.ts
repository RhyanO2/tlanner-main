import { type FastifyReply, type FastifyRequest } from 'fastify';
import crypto from 'node:crypto';

const ABACATEPAY_PUBLIC_KEY =
  't9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9';

export async function verifyAbacateSignature(
  rawBody: string,
  signatureFromHeader: string
) {
  const bodyBuffer = Buffer.from(rawBody, 'utf-8');

  const expectedSig = crypto
    .createHmac('sha256', ABACATEPAY_PUBLIC_KEY)
    .update(bodyBuffer)
    .digest('base64');

  const A = Buffer.from(expectedSig);
  const B = Buffer.from(signatureFromHeader);

  return A.length === B.length && crypto.timingSafeEqual(A, B);
}

export async function AbacateSignatureHook(
  req: FastifyRequest,
  res: FastifyReply
) {
  const signature = req.headers['x-webhook-signature'] as string;
  const rawBody = JSON.stringify(req.body);

  if (!signature || !verifyAbacateSignature(rawBody, signature)) {
    res.status(401).send({ error: 'Invalid signature key' });
  }
}
