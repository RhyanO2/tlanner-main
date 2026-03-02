import type { ConnectionOptions } from 'bullmq';

if (!process.env.REDIS_URL) {
  console.log('[Queue Connection] Nao foi possível conectar com o REDIS');
}

const REDIS_URL = process.env.REDIS_URL ?? 'ERROR';
const url = new URL(REDIS_URL);

console.log(url);

export const queueConnection: ConnectionOptions = {
  host: url.hostname,
  port: Number(url.port) || 6379,
  password: url.password,
  tls: REDIS_URL.startsWith('rediss://') ? {} : undefined,
};
