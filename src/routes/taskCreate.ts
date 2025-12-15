import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/index.ts';
import { Tasks } from '../database/schema.ts';
import z from 'zod';

export const createTask: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/tasks/:id',
    {
      schema: {
        summary: 'Create a task',
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          title: z.string(),
          description: z.string(),
          // status: z.enum([]),
          // due_date: z.string(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      const { title, description } = req.body;
      const userID = req.params.id;

      // const date = new Date(due_date);
      


      await db.insert(Tasks).values([
      {
        title: title,
        description: description,
        due_date: new Date(),
        id_user: userID
      },
    ]).returning()

      res.status(201).send({message:'Task created!'});
    }
  );
};



