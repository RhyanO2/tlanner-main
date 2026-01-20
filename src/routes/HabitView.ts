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

        // response: {
        //   200: z.object({ message: z.string() }),
        //   400: z.object({ message: z.string() }),
        //   500: z.object({ message: z.string() }),
        // },
      },
    },

    getHabitsByUserID
  );
};
