import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import { getWorkspaceByID } from '../controllers/workspaceControllers.js';

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
                id: z.uuid(),
                title: z.string(),
                id_user: z.uuid(),
              })
            ),
          }),
        },
      },
    },
    getWorkspaceByID
  );
};
