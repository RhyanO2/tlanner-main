import Redis from 'ioredis';
import 'dotenv/config';

const url = process.env.REDIS_URL;
// const token = process.env.REDIS_TOKEN;

console.log('REDIS_URL:', url);

if (!url) {
  console.warn('⚠️ Redis não configurado');
}

export const redis = url
  ? new Redis(url, { tls: { rejectUnauthorized: false } })
  : null;

console.log(redis ? '(redis) configurado' : '⚠️ Redis desabilitado');
