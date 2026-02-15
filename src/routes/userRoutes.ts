import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { login, register } from '../controllers/userControllers.js';

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
          201: z.object({ User: z.uuid() }),
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
          409: z.object({
            message: z.string(),
          }),
        },
      },
    },
    register
  );
};
export const loginRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/login',
    {
      schema: {
        summary: 'Login',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
            token: z.string(),
          }),
          401: z.object({ message: z.string() }),

          400: z.object({ message: z.string() }),
        },
      },
    },
    login
  );
};
