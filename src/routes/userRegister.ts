import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { register } from '../controllers/userControllers.ts';

export const registerRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/register',
    {
      schema: {
        summary: 'Register a user',
        body: z.object({
          name: z.string(),
          email: z.string(),
          password: z.string(),
        }),
        response: {
          201: z.object({ User: z.string() }),
        },
      },
    },
    register
  );
};
