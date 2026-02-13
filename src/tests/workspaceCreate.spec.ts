import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';

import { server } from '../app.js';
import { authenticateCreatedUser } from './factories/makeUser.js';

import { faker as f } from '@faker-js/faker';
import { cleanTestDatabase } from './helpers/db.helper.js';

describe('Workspace Create', () => {
   beforeEach(async () => {
    await cleanTestDatabase();
  });
  test('Create user workspace', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();

    const response = await request(server.server)
      .post(`/workspace`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        title: f.lorem.word(),
        id_user: user.id,
      });
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      workspace: expect.any(Object),
    });
  });
  test('Create user workspace', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();

    const response = await request(server.server)
      .post(`/workspace`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        title: f.lorem.word(),
        id_user: user,
      });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
