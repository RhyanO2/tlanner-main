import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/index.ts';
import { Tasks, Users } from '../database/schema.ts';
import z from 'zod';
import { title } from 'node:process';
import { eq } from 'drizzle-orm';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { delTask } from '../controllers/taskControllers.ts';

export const deleteTask: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/tasks/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Delete an existent task',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({ message: z.string() }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    delTask
  );
};
