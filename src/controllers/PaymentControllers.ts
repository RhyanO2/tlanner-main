import { type FastifyReply, type FastifyRequest } from 'fastify';

export async function abacatepayWebHook(
  req: FastifyRequest,
  res: FastifyReply
) {
  const { webhookSecret } = req.query as { webhookSecret: string };
  if (webhookSecret !== process.env.ABACATE_WEBHOOK_SECRET) {
    res.status(401).send({ error: 'Invalid webhook secret' });
  }
  const event = req.body;
  console.log('Received webhook:', event);
  res.status(200).send({ received: true });
}
