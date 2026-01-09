import { test, expect, describe } from 'vitest';
import request from 'supertest';

import { server } from '../app.js';
import { authenticateCreatedUser } from './factories/makeUser.js';
// import { faker } from '@faker-js/faker';
import { makeTaskInWorkspace } from './factories/makeTaskWorkspaceID.js';
import { makeWorkspace } from './factories/makeUserWorkspace.js';

describe('Task view', () => {
  test('View all tasks related to an user Workspace', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspaceID = (await makeWorkspace(user.id)).id;
    const taskID = await makeTaskInWorkspace(workspaceID);

    const response = await request(server.server)
      .get(`/workspace/${workspaceID}/tasks`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      workspace: expect.any(String),
      tasks: expect.any(Array),
    });
  });
});
