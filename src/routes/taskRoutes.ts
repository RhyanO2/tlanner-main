import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import {
  delTask,
  editTask,
  getTaskByID,
  postTask,
} from '../controllers/taskControllers.js';

export const getTasks: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/task/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Get task by ID',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            tasks: z.array(
              z.object({
                taskID: z.uuid(),
                title: z.string(),
                status: z.enum(['pending', 'in_progress', 'done']),
                priority: z.enum(['low', 'normal', 'high', 'urgent']),
                description: z.string(),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    getTaskByID
  );
};
export const createTask: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/workspace/:workspaceID/tasks',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Create task',
        body: z.object({
          title: z.string(),
          description: z.string(),
          // status: z.enum([]),
          due_date: z.string().nullable(),
          // workspaceID: z.string(),
          priority: z.enum(['low', 'normal', 'high', 'urgent']),
        }),
        response: {
          201: z.object({
            task: z.object({
              title: z.string(),
              description: z.string(),
              due_date: z.coerce.date().nullable(),
              priority: z.enum(['low', 'normal', 'high', 'urgent']),
              id: z.uuid(),
              status: z.enum(['pending', 'in_progress', 'done']),
              id_workspace: z.uuid(),
            }),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    postTask
  );
};
export const putTask: FastifyPluginAsyncZod = async (server) => {
  server.put(
    '/task/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Edit a created task',
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          title: z.string(),
          description: z.string(),
          status: z.enum(['pending', 'in_progress', 'done']),
          due_date: z.string().nullable(),
          priority: z.enum(['low', 'normal', 'high', 'urgent']),
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
export const deleteTask: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/task/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Delete an existent task',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          204: z.void(),
          404: z.object({ message: z.string() }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    delTask
  );
};
