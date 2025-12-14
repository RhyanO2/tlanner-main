import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { db } from '../database/index.ts';
import { Tasks, Users } from '../database/schema.ts';
import z, { object } from 'zod';
import { ilike, SQL, eq } from 'drizzle-orm';

export const getTasks: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/tasks/:id',
    {
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
    },
    async (request, reply) => {
      const userID = request.params.id;

      const results = await db
        .select({
          title: Tasks.title,
          status: Tasks.status,
          description: Tasks.description,
          userRelated: Tasks.id_user,
        })
        .from(Tasks)
        .where(eq(Tasks.id_user, userID));
      console.log(results);
      reply.status(200).send({
        user: userID,
        tasks: results,
      });
    }
  );
};
