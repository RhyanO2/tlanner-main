import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';

import { server } from '../app.js';
import { authenticateCreatedUser } from './factories/makeUser.js';

import { faker as f } from '@faker-js/faker';
import { makeWorkspace } from './factories/makeUserWorkspace.js';
import { cleanTestDatabase } from './helpers/db.helper.js';

describe('Workspace Create', () => {
   beforeEach(async () => {
    await cleanTestDatabase();
  });
  test('Edit created user workspace', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);

    const response = await request(server.server)
      .put(`/workspace/${workspace.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        title: f.lorem.word(),
      });
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
  test('Edit created wrong params', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);

    const response = await request(server.server)
      .put(`/workspace/${workspace}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        title: f.lorem.word(),
      });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
