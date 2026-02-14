import { redis } from '../config/redis';

const DEFAULT_TTL = 300;

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    if (!redis) return null;

    const cached = await redis.get<T>(key);
    if (!cached) return null;
    return cached ?? null;
  } catch {
    return null;
  }
}

export async function setCache(
  key: string,
  data: unknown,
  ttl = DEFAULT_TTL
): Promise<void> {
  try {
    if (!redis) return;

    await redis.set(key, JSON.stringify(data), { ex: ttl });
  } catch {}
}

export async function deleteCache(key: string): Promise<void> {
  try {
    if (!redis) return;

    await redis.del(key);
  } catch {}
}

export async function deleteCacheByPattern(pattern: string): Promise<void> {
  try {
    if (!redis) return;

    let cursor = '0';
    do {
      const result = await redis.scan(cursor, { match: pattern, count: 100 });
      cursor = result[0];
      const keys = result[1];

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');
  } catch {
    // falha silenciosa
  }
}
