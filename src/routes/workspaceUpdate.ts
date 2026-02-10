import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import { PutWorkspace } from '../controllers/workspaceControllers.js';

export const WorkspacePut: FastifyPluginAsyncZod = async (server) => {
  server.put(
    '/workspace/:id',
    {
      preHandler: [checkRequestJWT],

      schema: {
        params: z.object({
          id: z.uuid(),
        }),
        summary: 'Edit a workspace',
        body: z.object({
          title: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    PutWorkspace
  );
};
