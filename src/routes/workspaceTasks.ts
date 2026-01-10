import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import {
  getTaskByID,
  getWorkspaceTasks,
} from '../controllers/taskControllers.js';

export const WorkspaceTasks: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/workspace/:id/tasks',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary:
          'Get tasks related to an user workspace parsing userWorkspaceID',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            workspace: z.uuid(),
            tasks: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string(),
                priority: z.enum(['low', 'normal', 'high', 'urgent']),
                status: z.enum(['pending', 'in_progress', 'done']),
                due_date: z.string(),
                id_workspace: z.uuid(),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    getWorkspaceTasks
  );
};
