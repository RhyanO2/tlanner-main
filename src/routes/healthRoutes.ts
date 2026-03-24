import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { sql } from 'drizzle-orm';
import z from 'zod';

import { db } from '../database/index.js';
import { redis } from '../cache/redis.js';

export const healthRoutes: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/health',
    {
      schema: {
        summary: 'Service liveness probe',
        response: {
          200: z.object({
            status: z.literal('ok'),
            service: z.string(),
            timestamp: z.string(),
            version: z.string(),
          }),
        },
      },
    },
    async (_, res) => {
      const version = process.env.npm_package_version || '1.0.0';

      res.status(200).send({
        status: 'ok',
        service: 'tlanner-main',
        timestamp: new Date().toISOString(),
        version,
      });
    }
  );

  server.get(
    '/ready',
    {
      schema: {
        summary: 'Service readiness probe',
        response: {
          200: z.object({
            status: z.literal('ready'),
            checks: z.object({
              db: z.literal('up'),
              redis: z.enum(['up', 'disabled']),
            }),
          }),
          503: z.object({
            status: z.literal('not_ready'),
            checks: z.object({
              db: z.enum(['up', 'down']),
              redis: z.enum(['up', 'down', 'disabled']),
            }),
          }),
        },
      },
    },
    async (_, res) => {
      let dbStatus: 'up' | 'down' = 'up';
      let redisStatus: 'up' | 'down' | 'disabled' = redis ? 'up' : 'disabled';

      try {
        await db.execute(sql`select 1`);
      } catch {
        dbStatus = 'down';
      }

      if (redis) {
        try {
          await redis.ping();
        } catch {
          redisStatus = 'down';
        }
      }

      const isReady = dbStatus === 'up' && redisStatus !== 'down';

      if (!isReady) {
        return res.status(503).send({
          status: 'not_ready',
          checks: {
            db: dbStatus,
            redis: redisStatus,
          },
        });
      }

      return res.status(200).send({
        status: 'ready',
        checks: {
          db: 'up',
          redis: redisStatus === 'disabled' ? 'disabled' : 'up',
        },
      });
    }
  );
};
