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
  test('Delete a created user workspace', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);

    const response = await request(server.server)
      .delete(`/workspace/${workspace.id}`)
      .set('Authorization', token);

    expect(response.status).toEqual(204);
  });
  test('Delete a created user workspace', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);

    const response = await request(server.server)
      .delete(`/workspace/${workspace}`)
      .set('Authorization', token);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
