import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { githubAuth } from '../controllers/userControllers';

export const callbackGithub: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/api/auth/callback/github',
    {
      schema: {
        summary: 'Github OAuth Callback',
        querystring: z.object({
          code: z.string(),
        }),
      },
    },

    githubAuth
  );
};
