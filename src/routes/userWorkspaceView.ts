import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { getUserWorkspaces } from '../controllers/workspaceControllers.ts';

export const userWorkspaces: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/user/:userID/workspaces',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Get tasks related to an user by ID',
        params: z.object({
          userID: z.uuid(),
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
    getUserWorkspaces
  );
};
