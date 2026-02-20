import { type FastifyReply, type FastifyRequest } from 'fastify';
import { abacatePayService } from '../services/abacatePayService';

// Verifica se o webhook secret passado é igual ou diferente do passado nas variaveis de ambiente
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

export async function createBilling(req: FastifyRequest, res: FastifyReply) {
  try {
    const { data } = await abacatePayService.createBilling(req.body);
    res.send(data);
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function getQRcodePixStatus(req: FastifyRequest, res: FastifyReply) {
  try {
    const {id} = req.query as {id:string}
    const  pixQrCodeStatus  = await abacatePayService.checkPix(id);
    res.status(200).send(pixQrCodeStatus)
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function createQRcodePix(req: FastifyRequest, res: FastifyReply) {
  try {
    const { data } = await abacatePayService.createQRcodePix(req.body);
    res.send(data);
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}