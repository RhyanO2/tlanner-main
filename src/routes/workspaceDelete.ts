import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { DeleteWorkspace } from '../controllers/workspaceControllers.ts';

export const WorkspaceDelete: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/workspace/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Delete a workspace parsing ID',
        params: z.object({
          id: z.uuid(),
        }),
      },
    },
    DeleteWorkspace
  );
};
