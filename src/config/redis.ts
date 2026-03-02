import Redis from 'ioredis';
import 'dotenv/config';

const url = process.env.REDIS_URL;

if (!url) {
  console.warn('⚠️ Redis não configurado');
}

export const redis = url
  ? new Redis(url, { tls: { rejectUnauthorized: false } })
  : null;

console.log(redis ? '(redis) configurado' : '⚠️ Redis desabilitado');
