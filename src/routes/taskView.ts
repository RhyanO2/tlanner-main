import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/index.ts';
import { Tasks, Users } from '../database/schema.ts';
import z, { object } from 'zod';
import { ilike, SQL, eq } from 'drizzle-orm';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { getTaskByUserID } from '../controllers/taskControllers.ts';
// import { getAuthenticatedUserFromRequest } from '../utils/authUser.ts';

export const getTasks: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/tasks/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Get tasks related to an user by ID',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            user: z.string(),
            tasks: z.array(
              z.object({
                title: z.string(),
                status: z.enum(['pending', 'in_progress', 'done']),
                description: z.string(),
                userRelated: z.string(),
              })
            ),
          }),
        },
      },
    },getTaskByUserID
  );
};
