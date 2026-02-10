import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import { getUserWorkspaces } from '../controllers/workspaceControllers.js';
import { Workspace } from '../database/schema.js';

export const userWorkspaces: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/user/:userID/workspaces',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Get workspaces related to an user',
        params: z.object({
          userID: z.uuid(),
        }),
        response: {
          200: z.object({
            workspaces: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                id_user: z.uuid(),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    getUserWorkspaces
  );
};
