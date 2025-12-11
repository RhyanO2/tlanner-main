import fastify from 'fastify';
import {validatorCompiler,serializerCompiler,type ZodTypeProvider, jsonSchemaTransform} from 'fastify-type-provider-zod'

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


server.get('/', async (request,reply)=>{
  reply.status(418).send({WORKING: 'This is fine!👍'})
})

export {server}