import { Redis } from 'ioredis';
import 'dotenv/config';

if (!process.env.REDIS_URL) {
  throw new Error('A variável REDIS_URL não foi definida no .env');
}

export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 200, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('Redis Connected!!!');
});

redis.on('error', (err) => {
  console.error('Redis ERROR:', err.message);
});
