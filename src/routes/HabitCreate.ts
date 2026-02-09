import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq';
import { postHabit } from '../controllers/habitControllers';

export const HabitPOST: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/habit',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Edit a created task parsing taskID',
        // params: z.object({
        //   userid: z.uuid(),
        // }),
        body: z.object({
          name: z.string(),
          frequency: z.enum(['daily', 'weekly', 'monthly']),
          id_user: z.uuid(),
        }),
        response: {
          201: z.object({
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
          500: z.object({ message: z.string() }),
        },
      },
    },

    postHabit
  );
};
