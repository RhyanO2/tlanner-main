import fastify from 'fastify';
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

server.withTypeProvider<ZodTypeProvider>();

if (process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Tlanner-api',
        version: '1.0.0',
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

server.register(TESTROUTE);
server.register(registerRoute);
server.register(loginRoute);
server.register(getTasks);
server.register(createTask);
server.register(putTask);
server.register(deleteTask);

export { server };
