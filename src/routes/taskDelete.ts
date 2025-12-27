import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { delTask } from '../controllers/taskControllers.ts';

export const deleteTask: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/task/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Delete an existent task',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    delTask
  );
};
