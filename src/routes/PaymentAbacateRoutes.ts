import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  abacatepayWebHook,
  createQRcodePix,
  createBilling,
  getQRcodePixStatus,
} from '../controllers/PaymentsControllers';
import { AbacateSignatureHook } from './hooks/verifyAbacateSignature';
import { checkRequestJWT } from './hooks/checkJWT-FromReq';

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

export const abacatePayCreateBill: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/billing/create',
    {
      preHandler: [checkRequestJWT],
      // schema:{}
    },
    createBilling
  );
};

export const abacatePayCreatePixQRcode: FastifyPluginAsyncZod = async (
  server
) => {
  server.post(
    '/pixQrCode/create',
    {
      preHandler: [checkRequestJWT],
      // schema:{}
    },
    createQRcodePix
  );
};
export const abacatePayCheckQrcodePixStatus: FastifyPluginAsyncZod = async (
  server
) => {
  server.get(
    '/pixQrCode/check',
    {
      preHandler: [checkRequestJWT],
      // schema:{}
    },
    getQRcodePixStatus
  );
};
