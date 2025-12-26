import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { PostWorkspace } from '../controllers/workspaceControllers.ts';

export const WorkspacePost: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/workspace',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Create a workspace parsind userid an title',
        body: z.object({
          title: z.string(),
          id_user: z.uuid(),
        }),
      },
    },
    PostWorkspace
  );
};
