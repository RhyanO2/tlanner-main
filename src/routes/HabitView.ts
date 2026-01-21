import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq';
import { getHabitsByUserID } from '../controllers/habitControllers';

export const habitsGET: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/user/:userID/habits',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Edit a created task parsing taskID',
        params: z.object({
          userID: z.uuid(),
        }),

        response: {
          200: z.object({
            user: z.uuid(),
            habits: z.array(
              z.object({
                name: z.string(),
                id: z.uuid(),
                id_user: z.uuid(),
                frequency: z.enum(['daily', 'weekly', 'monthly']),
                created_at: z.date().nullable(),
              })
            ),
          }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },

    getHabitsByUserID
  );
};
