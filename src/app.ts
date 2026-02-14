import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import { registerRoute } from './routes/userRegister';
import { fastifySwagger } from '@fastify/swagger';
import scalarAPIReference from '@scalar/fastify-api-reference';
import { loginRoute } from './routes/userLogin';
import { TESTROUTE } from './routes/testRoute';
import { getTasks } from './routes/taskView';
import { createTask } from './routes/taskCreate';
import { fastifyServer as server } from './config/fastifyServer';
import { putTask } from './routes/taskUpdate';
import { deleteTask } from './routes/taskDelete';
import { userWorkspaces } from './routes/userWorkspaceView';
import { getWorkspace } from './routes/workspaceView';
import { WorkspacePost } from './routes/workspaceCreate';
import { WorkspacePut } from './routes/workspaceUpdate';
import { WorkspaceDelete } from './routes/workspaceDelete';
import cors from '@fastify/cors';
import { WorkspaceTasks } from './routes/workspaceTasks';
import { githubOAuth } from './routes/githubOAuth';
import { callbackGithub } from './routes/githubCallback';
import { HabitPOST } from './routes/HabitCreate';
import { habitPUT } from './routes/HabitUpdate';
import { habitDelete } from './routes/HabitDelete';
import { habitsGET } from './routes/HabitView';
import { redisHealthRoute } from './routes/redisHealth';
import rateLimit from '@fastify/rate-limit';

server.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes',
});

server.withTypeProvider<ZodTypeProvider>();

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

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

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
server.register(redisHealthRoute);
export { server };
