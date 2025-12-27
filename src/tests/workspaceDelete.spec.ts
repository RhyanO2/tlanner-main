import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { authenticateCreatedUser } from './factories/makeUser.ts';

import { faker as f } from '@faker-js/faker';
import { makeWorkspace } from './factories/makeUserWorkspace.ts';

describe('Workspace Create', () => {
  test('Delete a created user workspace', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);

    const response = await request(server.server)
      .delete(`/workspace/${workspace.id}`)
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
