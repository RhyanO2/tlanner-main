import { Redis } from '@upstash/redis';
import 'dotenv/config';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.warn('⚠️ Upstash Redis não configurado');
}

export const redis = url && token ? new Redis({ url, token }) : null;

console.log(redis ? '✅ Redis (Upstash) configurado' : '⚠️ Redis desabilitado');
