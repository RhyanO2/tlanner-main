import { test, expect, describe } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { authenticateCreatedUser } from './factories/makeUser.ts';
import { faker } from '@faker-js/faker';
import { makeTaskInWorkspace } from './factories/makeTaskWorkspaceID.ts';
import { makeWorkspace } from './factories/makeUserWorkspace.ts';

describe('Task view', () => {
  test('View all tasks related to an user Workspace', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspaceID = (await makeWorkspace(user.id)).id;
    const taskID = (await makeTaskInWorkspace(workspaceID)).id;

    const response = await request(server.server)
      .get(`/task/${taskID}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      workspace: taskID,
      tasks: expect.any(Array),
    });
  });
  test('cannot find task', async () => {
    await server.ready();

    const user = faker.string.uuid();
    const { token } = await authenticateCreatedUser();

    const response = await request(server.server)
      .get(`/task/${user}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      message: 'Cannot find task related to this user workspace',
    });
  });
});
