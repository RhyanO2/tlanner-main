import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

export const TESTROUTE:FastifyPluginAsyncZod = async(server)=>{
  server.get('/',
    async (request,reply)=>{
   reply.status(418).send({WORKING: 'This is fine!👍'})
})

}






