import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/index.ts';
import { Tasks, Users } from '../database/schema.ts';
import z from 'zod';
import { title } from 'node:process';
import { eq } from 'drizzle-orm';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { editTask } from '../controllers/taskControllers.ts';

export const putTask: FastifyPluginAsyncZod = async (server) => {
  server.put(
    '/tasks/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          title: z.string(),
          description: z.string(),
          status: z.enum(['pending', 'in_progress', 'done']),
          due_date: z.string(),
        }),
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    editTask
  );
};
