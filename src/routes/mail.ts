import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';



export const mail: FastifyPluginAsyncZod = async(server) =>{
  server.get('/send',
    
    
    (req,res)=>{
    const {mailer} = server


  })




}