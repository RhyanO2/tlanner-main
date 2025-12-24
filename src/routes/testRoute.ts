import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

export const TESTROUTE: FastifyPluginAsyncZod = async (server) => {
  server.get('/',{
    schema:{
      summary: 'Check the connection with server'
    }



  }, async (req, res) => {
    res.status(418).send({ WORKING: 'This is fine!👍' });
  });
};
