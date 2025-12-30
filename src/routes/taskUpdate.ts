import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq';
import { editTask } from '../controllers/taskControllers';

export const putTask: FastifyPluginAsyncZod = async (server) => {
  server.put(
    '/task/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Edit a created task',
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          title: z.string(),
          description: z.string(),
          status: z.enum(['pending', 'in_progress', 'done']),
          due_date: z.string(),
          priority: z.enum(['low', 'normal', 'high', 'urgent']),
        }),
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    editTask
  );
};
