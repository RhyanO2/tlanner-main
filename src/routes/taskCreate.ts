import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/index.ts';
import { Tasks } from '../database/schema.ts';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';
import { postTask } from '../controllers/taskControllers.ts';

export const createTask: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/tasks/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Create a task',
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          title: z.string(),
          description: z.string(),
          // status: z.enum([]),
          due_date: z.string(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    postTask
  );
};
