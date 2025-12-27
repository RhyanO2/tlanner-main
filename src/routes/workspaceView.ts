import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { getWorkspaceByID } from '../controllers/workspaceControllers.ts';
import { title } from 'node:process';

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
        response: {
          200: z.object({
            results: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                id_user: z.string(),
              })
            ),
          }),
        },
      },
    },
    getWorkspaceByID
  );
};
