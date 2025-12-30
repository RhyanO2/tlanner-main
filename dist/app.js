import { validatorCompiler, serializerCompiler, jsonSchemaTransform, } from 'fastify-type-provider-zod';
import { registerRoute } from './routes/userRegister.js';
import { fastifySwagger } from '@fastify/swagger';
import scalarAPIReference from '@scalar/fastify-api-reference';
import { loginRoute } from './routes/userLogin.js';
import { TESTROUTE } from './routes/testRoute.js';
import { getTasks } from './routes/taskView.js';
import { createTask } from './routes/taskCreate.js';
import { fastifyServer as server } from './config/fastifyServer.js';
import { putTask } from './routes/taskUpdate.js';
import { deleteTask } from './routes/taskDelete.js';
import { userWorkspaces } from './routes/userWorkspaceView.js';
import { getWorkspace } from './routes/workspaceView.js';
import { WorkspacePost } from './routes/workspaceCreate.js';
import { WorkspacePut } from './routes/workspaceUpdate.js';
import { WorkspaceDelete } from './routes/workspaceDelete.js';
import cors from '@fastify/cors';
import { WorkspaceTasks } from './routes/workspaceTasks.js';
server.withTypeProvider();
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
