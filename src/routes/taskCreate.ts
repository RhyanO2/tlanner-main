import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import { postTask } from '../controllers/taskControllers.js';

export const createTask: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/workspace/:workspaceID/tasks',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary:
          '  Create task parsing a userWorkspaceID that the task will be related ',
        body: z.object({
          title: z.string(),
          description: z.string(),
          // status: z.enum([]),
          due_date: z.string(),
          // workspaceID: z.string(),
          priority: z.enum(['low', 'normal', 'high', 'urgent']),
        }),
        response: {
          201: z.object({
            task: z.object({
              title: z.string(),
              description: z.string(),
              due_date: z.date(),
              priority: z.enum(['low', 'normal', 'high', 'urgent']),
              id: z.uuid(),
              status: z.enum(['pending', 'in_progress', 'done']),
              id_workspace: z.uuid(),
            }),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    postTask
  );
};
