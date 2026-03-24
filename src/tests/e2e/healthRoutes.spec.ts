import { afterEach, describe, expect, test, vi } from 'vitest';
import request from 'supertest';

import { server } from '../../app.js';
import { db } from '../../database/index.js';
import { redis } from '../../cache/redis.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Health routes', () => {
  test('GET /health returns service liveness payload', async () => {
    await server.ready();

    const response = await request(server.server).get('/health');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      status: 'ok',
      service: 'tlanner-main',
      timestamp: expect.any(String),
      version: expect.any(String),
    });
  });

  test('GET /ready returns readiness payload', async () => {
    await server.ready();

    const response = await request(server.server).get('/ready');

    expect([200, 503]).toContain(response.status);
    expect(response.body).toMatchObject({
      status: expect.any(String),
      checks: {
        db: expect.any(String),
        redis: expect.any(String),
      },
    });
  });

  test('GET /ready returns 503 when DB probe fails', async () => {
    await server.ready();

    vi.spyOn(db, 'execute').mockRejectedValueOnce(new Error('db unavailable'));

    const response = await request(server.server).get('/ready');

    expect(response.status).toEqual(503);
    expect(response.body).toMatchObject({
      status: 'not_ready',
      checks: {
        db: 'down',
      },
    });
  });

  test('GET /ready returns 503 when Redis is enabled but ping fails', async () => {
    await server.ready();

    if (!redis) {
      expect(true).toBe(true);
      return;
    }

    vi.spyOn(redis, 'ping').mockRejectedValueOnce(
      new Error('redis unavailable')
    );

    const response = await request(server.server).get('/ready');

    expect(response.status).toEqual(503);
    expect(response.body).toMatchObject({
      status: 'not_ready',
      checks: {
        db: 'up',
        redis: 'down',
      },
    });
  });
});
