import { test, expect, describe } from 'vitest';
import request from 'supertest';

import { server } from '../app.js';
import { authenticateCreatedUser } from './factories/makeUser.js';

import { makeTaskInWorkspace } from './factories/makeTaskWorkspaceID.js';
import { makeWorkspace } from './factories/makeUserWorkspace.js';

describe('Task view', () => {
  test('View all tasks related to an user Workspace', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const userid = user.id;
    const workspace = await makeWorkspace(userid);
    const workspaceID = (await makeTaskInWorkspace(workspace.id)).id_workspace;

    const response = await request(server.server)
      .get(`/workspace/${workspaceID}/tasks`)
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      workspace: expect.any(String),
      tasks: expect.any(Array),
    });
  });
  test('Wrong req params', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const userid = user.id;
    const workspace = await makeWorkspace(userid);
    const workspaceID = await makeTaskInWorkspace(workspace.id);

    const response = await request(server.server)
      .get(`/workspace/${workspace}/tasks`)
      .set('Authorization', token);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
