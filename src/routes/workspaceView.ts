import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { getWorkspaceByID } from '../controllers/workspaceControllers.ts';

export const getWorkspace: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/workspace/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Get workspace by ID',
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
    getWorkspaceByID
  );
};
