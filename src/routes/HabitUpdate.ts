import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq';
import { editHabit } from '../controllers/habitControllers';

export const habitPUT: FastifyPluginAsyncZod = async (server) => {
  server.put(
    '/habit/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Edit a Habit',
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          name: z.string(),
          frequency: z.enum(['daily', 'weekly', 'monthly']),
        }),
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },

    editHabit
  );
};
