import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { redis } from '../config/redis';

export const redisHealthRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/health/redis',
    {
      schema: {
        summary: 'Check Redis connection status',
        response: {
          200: z.object({
            redis: z.enum(['connected', 'disconnected']),
            ping: z.string(),
            uptime: z.number(),
            memoryUsed: z.string(),
            totalKeys: z.number(),
          }),
          500: z.object({
            redis: z.enum(['connected', 'disconnected']),
            error: z.string(),
          }),
        },
      },
    },
    async (req, res) => {
      try {
        // 1. PING — se o Redis responde "PONG", está vivo
        const ping = await redis.ping();

        // 2. INFO — pega estatísticas do Redis
        const info = await redis.info('memory');
        const memoryMatch = info.match(/used_memory_human:(\S+)/);
        const memoryUsed = memoryMatch ? memoryMatch[1] : 'unknown';

        // 3. Uptime
        const serverInfo = await redis.info('server');
        const uptimeMatch = serverInfo.match(/uptime_in_seconds:(\d+)/);
        const uptime = uptimeMatch ? Number(uptimeMatch[1]) : 0;

        // 4. Total de chaves no banco
        const totalKeys = await redis.dbsize();

        res.status(200).send({
          redis: 'connected',
          ping,          // deve ser "PONG"
          uptime,        // segundos desde que o Redis iniciou
          memoryUsed,    // ex: "1.23M"
          totalKeys,     // quantas chaves existem agora
        });
      } catch (err: any) {
        res.status(500).send({
          redis: 'disconnected',
          error: err.message,
        });
      }
    }
  );
};