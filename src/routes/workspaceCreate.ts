import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import { PostWorkspace } from '../controllers/workspaceControllers.js';

export const WorkspacePost: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/workspace',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Create a workspace',
        body: z.object({
          title: z.string(),
          id_user: z.uuid(),
        }),
        response: {
          201: z.object({
            workspace: z.object({
              id: z.uuid(),
              title: z.string(),
              id_user: z.uuid(),
            }),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    PostWorkspace
  );
};
