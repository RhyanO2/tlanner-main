import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq';
import { delHabit, editHabit } from '../controllers/habitControllers';

export const habitDelete: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/habit/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Delete an existent Habit',
        params: z.object({
          id: z.uuid(),
        }),

        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },

    delHabit
  );
};
