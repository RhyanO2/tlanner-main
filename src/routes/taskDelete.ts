import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/index.ts';
import { Tasks, Users } from '../database/schema.ts';
import z from 'zod';
import { title } from 'node:process';
import { eq } from 'drizzle-orm';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';

export const deleteTask: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/tasks/:id',
    {
      preHandler:[
        checkRequestJWT
      ],
      schema: {
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({ messaqe: z.string() }),
        },
      },
    },
    async (req, res) => {
      const taskID = req.params.id;
      
      await db.delete(Tasks).where(eq(Tasks.id, taskID));

      res.status(200).send({ messaqe: 'Task Deleted!' });
    }
  );
};
