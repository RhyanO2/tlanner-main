import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { getUserWorkspaces } from '../controllers/workspaceControllers.ts';
import { Workspace } from '../database/schema.ts';

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
        response: {
          200: z.object({
            workspaces: z.array(
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
    getUserWorkspaces
  );
};
