import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import { getTaskByID } from '../controllers/taskControllers.js';

export const getTasks: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/task/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Get taks details parsing taskID',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            tasks: z.array(
              z.object({
                taskID: z.uuid(),
                title: z.string(),
                status: z.enum(['pending', 'in_progress', 'done']),
                priority: z.enum(['low', 'normal', 'high', 'urgent']),
                description: z.string(),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    getTaskByID
  );
};
