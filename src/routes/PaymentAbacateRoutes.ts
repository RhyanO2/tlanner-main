import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {
  abacatepayWebHook,
  createQRcodePix,
  createBilling,
  getQRcodePixStatus,
} from '../controllers/PaymentsControllers';
import { AbacateSignatureHook } from './hooks/verifyAbacateSignature';
import { checkRequestJWT } from './hooks/checkJWT-FromReq';
import z from 'zod';

export const abacatePayWebhook: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/webhook/abacatepay',
    {
      preHandler: [AbacateSignatureHook],
    },
    abacatepayWebHook
  );
};

export const abacatePayCreateBill: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/billing/create',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Create a billing',
        body: z.object({
          frequency: z.enum(['ONE_TIME', 'MONTHLY', 'YEARLY']),
          methods: z.array(z.enum(['PIX', 'CARD'])).min(1),
          products: z
            .array(
              z.object({
                externalId: z.string(),
                name: z.string(),
                description: z.string().optional(),
                quantity: z.number().int().positive(),
                price: z.number().int().positive(),
              })
            )
            .min(1),
          returnUrl: z.string().url(),
          completionUrl: z.string().url(),
          customerId: z.string().optional(),
          customer: z
            .object({
              name: z.string(),
              cellphone: z.string(),
              email: z.string().email(),
              taxId: z.string(),
            })
            .optional(),
          allowCoupons: z.boolean().optional().default(false),
          coupons: z.array(z.string()).optional(),
          externalId: z.string().optional(),
          metadata: z.record(z.string(), z.unknown()).optional(),
        }),
      },
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
      schema: {
        summary: 'Create a PIX QR Code',
        body: z.object({
          amount: z.number().int().positive(),
          expiresIn: z.number().int().positive(),
          description: z.string().optional(),
          customer: z
            .object({
              name: z.string(),
              cellphone: z.string(),
              email: z.string().email(),
              taxId: z.string(),
            })
            .optional(),
          metadata: z.record(z.string(), z.unknown()).optional(),
        }),
      },
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
      schema: {
        summary: 'Check a PIX QR Code',
        querystring: z.object({
          id: z.string().startsWith('pix_char_'),
        }),
      },
    },
    getQRcodePixStatus
  );
};
