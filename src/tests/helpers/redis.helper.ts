import { redis } from '../../config/redis';

export async function cleanTestRedis() {
  await redis.flushdb();
}

export async function disconnectRedis() {
  await redis.quit();
}
cleanTestRedis();
disconnectRedis();
