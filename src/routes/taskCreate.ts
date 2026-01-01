import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z, { prettifyError } from 'zod';

import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import { postTask } from '../controllers/taskControllers.js';
import { priority } from '../database/schema.js';

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
          priority: z.enum(['low', 'normal', 'high', 'urgent']),
        }),
        // response: {
        //   201: z.object({
        //     task: z.object({
        //       id: z.uuid(),
        //       title: z.string,
        //       description: z.string,
        //       due_date: z.date(),
        //       priority: z.string(),
        //       workspaceID: z.uuid(),
        //     }),
        //   }),
        // },
      },
    },
    postTask
  );
};
