import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/index.ts';
import { Tasks, Users } from '../database/schema.ts';
import z from 'zod';
import { title } from 'node:process';
import { eq } from 'drizzle-orm';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.ts';

export const editTask: FastifyPluginAsyncZod = async (server) => {
  server.put(
    '/tasks/:id',
    {
      preHandler:[
        checkRequestJWT
      ],
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
        response:{
           200:z.object({messaqe:z.string()}),
        }
      },
    },
    async (req, res) => {
      const { title, description, status, due_date } = req.body;
      const taskID = req.params.id;
    

      const taskDate = new Date(due_date);

      await db
        .update(Tasks)
        .set({
          title: title,
          description: description,
          status: status,
          due_date: taskDate,
        })
        .where(eq(Tasks.id, taskID));

      res.status(200).send({ messaqe: 'Task Updated!' });
    }
  );
};
