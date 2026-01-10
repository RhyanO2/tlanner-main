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
    const userid = user.id;
    const workspace = await makeWorkspace(userid);
    const workspaceID = await makeTaskInWorkspace(workspace.id);

    const response = await request(server.server)
      .get(`/workspace/${workspaceID}/tasks`)
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      workspace: expect.any(String),
      tasks: expect.any(Array),
    });
  });
});
