import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { PutWorkspace } from '../controllers/workspaceControllers.ts';

export const WorkspacePut: FastifyPluginAsyncZod = async (server) => {
  server.put(
    '/workspace/:id',
    {
      preHandler: [checkRequestJWT],

      schema: {
        params: z.object({
          id: z.uuid(),
        }),
        summary: 'Create a workspace parsind userid an title',
        body: z.object({
          title: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    PutWorkspace
  );
};
