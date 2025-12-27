import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { postTask } from '../controllers/taskControllers.ts';

export const createTask: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/workspace/:workspaceID/tasks',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Create a task',
        body: z.object({
          title: z.string(),
          description: z.string(),
          // status: z.enum([]),
          due_date: z.string(),
          // workspaceID: z.string(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    postTask
  );
};
