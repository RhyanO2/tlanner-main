import fastify from 'fastify';
import {validatorCompiler,serializerCompiler,type ZodTypeProvider, jsonSchemaTransform} from 'fastify-type-provider-zod'
import { registerRoute } from './routes/userRegister.ts';
import {fastifySwagger} from '@fastify/swagger'
import scalarAPIReference from '@scalar/fastify-api-reference'

const server = fastify(
  {logger: {transport:{
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
},
).withTypeProvider<ZodTypeProvider>()


if(process.env.NODE_ENV === 'development'){server.register(fastifySwagger,{
  openapi:{
    info: {
      title: 'Tlanner-api',
      version: '1.0.0',
    }
  },
  transform: jsonSchemaTransform,
});

server.register(scalarAPIReference,{
  routePrefix:'/api-docs',
 
})}

server.get('/', async (request,reply)=>{
  reply.status(418).send({WORKING: 'This is fine!👍'})
})

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(registerRoute)


export {server}