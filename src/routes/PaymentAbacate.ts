import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { abacatepayWebHook } from '../controllers/PaymentControllers';
import {
  AbacateSignatureHook,
  verifyAbacateSignature,
} from './hooks/verifyAbacateSignature';

export const abacatePayWebhook: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/webhook/abacatepay',
    {
      preHandler: [AbacateSignatureHook],
      // schema:{}
    },
    abacatepayWebHook
  );
};
