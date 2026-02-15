import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import {
  DeleteWorkspace,
  getUserWorkspaces,
  getWorkspaceByID,
  PostWorkspace,
  PutWorkspace,
} from '../controllers/workspaceControllers.js';
import { getWorkspaceTasks } from '../controllers/taskControllers.js';

export const getWorkspace: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/workspace/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Get workspace by ID',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            results: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                id_user: z.uuid(),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    getWorkspaceByID
  );
};
export const userWorkspaces: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/user/:userID/workspaces',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Get workspaces related to an user',
        params: z.object({
          userID: z.uuid(),
        }),
        response: {
          200: z.object({
            workspaces: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                id_user: z.uuid(),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    getUserWorkspaces
  );
};
export const WorkspaceTasks: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/workspace/:id/tasks',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Get tasks related to an workspace',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            workspace: z.uuid(),
            tasks: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
                description: z.string(),
                priority: z.enum(['low', 'normal', 'high', 'urgent']),
                status: z.enum(['pending', 'in_progress', 'done']),
                due_date: z.coerce.date().nullable(),
                id_workspace: z.uuid(),
              })
            ),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    getWorkspaceTasks
  );
};
export const WorkspacePost: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/workspace',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Create a workspace',
        body: z.object({
          title: z.string(),
          id_user: z.uuid(),
        }),
        response: {
          201: z.object({
            workspace: z.object({
              id: z.uuid(),
              title: z.string(),
              id_user: z.uuid(),
            }),
          }),
          400: z.object({ message: z.string() }),
        },
      },
    },
    PostWorkspace
  );
};
export const WorkspacePut: FastifyPluginAsyncZod = async (server) => {
  server.put(
    '/workspace/:id',
    {
      preHandler: [checkRequestJWT],

      schema: {
        params: z.object({
          id: z.uuid(),
        }),
        summary: 'Edit a workspace',
        body: z.object({
          title: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    PutWorkspace
  );
};

export const WorkspaceDelete: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/workspace/:id',
    {
      preHandler: [checkRequestJWT],
      schema: {
        summary: 'Delete a workspace',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          204: z.void,
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    DeleteWorkspace
  );
};
