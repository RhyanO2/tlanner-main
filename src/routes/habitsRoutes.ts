import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq';
import { delHabit, editHabit, getHabitsByUserID, postHabit } from '../controllers/habitControllers';

export const habitsGET: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/user/:userID/habits',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Get User Habits',
        params: z.object({
          userID: z.uuid(),
        }),

        response: {
          200: z.object({
            user: z.uuid(),
            habits: z.array(
              z.object({
                name: z.string(),
                id: z.uuid(),
                id_user: z.uuid(),
                frequency: z.enum(['daily', 'weekly', 'monthly']),
                created_at: z.coerce.date().nullable(),
              })
            ),
          }),
          400: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },

    getHabitsByUserID
  );
};

export const HabitPOST: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/habit',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Create Habit',
        body: z.object({
          name: z.string(),
          frequency: z.enum(['daily', 'weekly', 'monthly']),
          id_user: z.uuid(),
        }),
        response: {
          201: z.object({
            habits: z.array(
              z.object({
                name: z.string(),
                id: z.uuid(),
                id_user: z.uuid(),
                frequency: z.enum(['daily', 'weekly', 'monthly']),
                created_at: z.coerce.date().nullable(),
              })
            ),
          }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },

    postHabit
  );
};

export const habitPUT: FastifyPluginAsyncZod = async (server) => {
  server.put(
    '/habit/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Edit a Habit',
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          name: z.string(),
          frequency: z.enum(['daily', 'weekly', 'monthly']),
        }),
        response: {
          200: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },

    editHabit
  );
};


export const habitDelete: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/habit/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Delete an existent Habit',
        params: z.object({
          id: z.uuid(),
        }),

        response: {
          204: z.void,
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },

    delHabit
  );
};

