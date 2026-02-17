import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import { fastifyServer as server } from './config/fastifyServer';
import { fastifySwagger } from '@fastify/swagger';
import scalarAPIReference from '@scalar/fastify-api-reference';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import { wsRoute } from './websocket/wsRoute';
import { registerRoute, loginRoute } from './routes/userRoutes';
import { TESTROUTE } from './routes/testRoute';
import { getTasks, createTask, putTask, deleteTask } from './routes/taskRoutes';
import {
  getWorkspace,
  userWorkspaces,
  WorkspacePost,
  WorkspacePut,
  WorkspaceDelete,
  WorkspaceTasks,
} from './routes/workspaceRoutes';

import {
  habitsGET,
  HabitPOST,
  habitPUT,
  habitDelete,
} from './routes/habitsRoutes';

import { githubOAuth } from './routes/githubOAuth';
import { callbackGithub } from './routes/githubCallback';

server.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes',
});

server.withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
if (process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Tlanner-api',
        version: '1.1.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(scalarAPIReference, {
    routePrefix: '/api-docs',
  });
}
server.register(websocket);
server.register(wsRoute);

server.register(TESTROUTE);
server.register(registerRoute);
server.register(loginRoute);
server.register(getTasks);
server.register(createTask);
server.register(putTask);
server.register(deleteTask);
server.register(userWorkspaces);
server.register(getWorkspace);
server.register(WorkspacePost);
server.register(WorkspacePut);
server.register(WorkspaceDelete);
server.register(WorkspaceTasks);
server.register(githubOAuth);
server.register(callbackGithub);
server.register(HabitPOST);
server.register(habitPUT);
server.register(habitDelete);
server.register(habitsGET);
export { server };
