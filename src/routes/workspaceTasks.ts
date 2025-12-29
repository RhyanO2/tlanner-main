import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import {
  getTaskByID,
  getWorkspaceTasks,
} from '../controllers/taskControllers.ts';

export const WorkspaceTasks: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/workspace/:id/tasks',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Get tasks related to an user workspace',
        params: z.object({
          id: z.uuid(),
        }),
        // response: {
        //   200: z.object({
        //     user: z.string(),
        //     tasks: z.array(
        //       z.object({
        //         title: z.string(),
        //         status: z.enum(['pending', 'in_progress', 'done']),
        //         description: z.string(),
        //         userRelated: z.string(),
        //       })
        //     ),
        //   }),
        // },
      },
    },
    getWorkspaceTasks
  );
};
