import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { authenticateCreatedUser } from './factories/makeUser.ts';
import { makeWorkspace } from './factories/makeUserWorkspace.ts';
import { makeTaskInWorkspace } from './factories/makeTaskWorkspaceID.ts';

describe('Workspace views', () => {
  test('View all task from a user workspace ', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);
    const task = await makeTaskInWorkspace(workspace.id);

    const response = await request(server.server)
      .get(`/user/${user.id}/workspaces`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      workspaces: expect.any(Array),
    });
  });
  test('Query workspace info by ID ', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);

    const response = await request(server.server)
      .get(`/workspace/${workspace.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(expect.any(Object));
  });
});
