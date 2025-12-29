import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod';
import { registerRoute } from './routes/userRegister.ts';
import { fastifySwagger } from '@fastify/swagger';
import scalarAPIReference from '@scalar/fastify-api-reference';
import { loginRoute } from './routes/userLogin.ts';
import { TESTROUTE } from './routes/testRoute.ts';
import { getTasks } from './routes/taskView.ts';
import { createTask } from './routes/taskCreate.ts';
import { fastifyServer as server } from './config/fastifyServer.ts';
import { putTask } from './routes/taskUpdate.ts';
import { deleteTask } from './routes/taskDelete.ts';
import { userWorkspaces } from './routes/userWorkspaceView.ts';
import { getWorkspace } from './routes/workspaceView.ts';
import { WorkspacePost } from './routes/workspaceCreate.ts';
import { WorkspacePut } from './routes/workspaceUpdate.ts';
import { WorkspaceDelete } from './routes/workspaceDelete.ts';
import cors from '@fastify/cors';
import { WorkspaceTasks } from './routes/workspaceTasks.ts';

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

// Configure CORS - must be registered before routes
server.register(cors, {
  origin: true, // Allow all origins (for development)
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

export { server };
