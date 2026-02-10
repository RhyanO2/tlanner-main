import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';

export const githubOAuth: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/auth/github',
    {
      schema: {
        summary: 'Github OAuth Redirect',
      },
    },
    async (req, res) => {
      const githubURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user:email`;

      res.redirect(githubURL);
    }
  );
};
