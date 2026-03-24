import { test, expect, describe } from 'vitest';
import request from 'supertest';
import { faker as f } from '@faker-js/faker';

import { db } from '../../database/index.js';
import { Tasks } from '../../database/schema.js';

import { server } from '../../app.js';
import { authenticateCreatedUser } from '../factories/makeUser.js';

import { makeTaskInWorkspace } from '../factories/makeTaskWorkspaceID.js';
import { makeWorkspace } from '../factories/makeUserWorkspace.js';

describe('Task view', () => {
  test('View workspace tasks requires authentication', async () => {
    await server.ready();

    const { user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);
    await makeTaskInWorkspace(workspace.id);

    const response = await request(server.server).get(
      `/workspace/${workspace.id}/tasks`
    );

    expect(response.status).toEqual(401);
  });

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
    expect(response.body).toMatchObject({
      workspace: expect.any(String),
      tasks: expect.any(Array),
      meta: {
        limit: null,
        offset: 0,
        count: expect.any(Number),
        total: expect.any(Number),
      },
    });
  });

  test('View workspace tasks with pagination params', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);

    await makeTaskInWorkspace(workspace.id);
    await makeTaskInWorkspace(workspace.id);
    await makeTaskInWorkspace(workspace.id);

    const response = await request(server.server)
      .get(`/workspace/${workspace.id}/tasks?limit=2&offset=0`)
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.tasks.length).toBeLessThanOrEqual(2);
    expect(response.body.meta).toEqual({
      limit: 2,
      offset: 0,
      count: response.body.tasks.length,
      total: expect.any(Number),
    });
  });

  test('returns 404 when workspace has no tasks', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);

    const response = await request(server.server)
      .get(`/workspace/${workspace.id}/tasks`)
      .set('Authorization', token);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });

  test('filters tasks by status and keeps accurate meta total', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);

    await db.insert(Tasks).values([
      {
        title: f.lorem.words(2),
        description: f.lorem.words(3),
        status: 'pending',
        priority: 'normal',
        id_workspace: workspace.id,
      },
      {
        title: f.lorem.words(2),
        description: f.lorem.words(3),
        status: 'done',
        priority: 'high',
        id_workspace: workspace.id,
      },
    ]);

    const response = await request(server.server)
      .get(`/workspace/${workspace.id}/tasks?status=done`)
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.tasks.length).toBeGreaterThan(0);
    expect(
      response.body.tasks.every(
        (task: { status: string }) => task.status === 'done'
      )
    ).toBe(true);
    expect(response.body.meta.total).toEqual(response.body.tasks.length);
  });

  test('sorts tasks by title ascending', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);

    await db.insert(Tasks).values([
      {
        title: 'zeta task',
        description: f.lorem.words(3),
        status: 'pending',
        priority: 'normal',
        id_workspace: workspace.id,
      },
      {
        title: 'alpha task',
        description: f.lorem.words(3),
        status: 'pending',
        priority: 'normal',
        id_workspace: workspace.id,
      },
    ]);

    const response = await request(server.server)
      .get(`/workspace/${workspace.id}/tasks?sortBy=title&sortOrder=asc`)
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body.tasks[0].title <= response.body.tasks[1].title).toBe(
      true
    );
  });

  test('reject invalid pagination query params', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);
    await makeTaskInWorkspace(workspace.id);

    const response = await request(server.server)
      .get(`/workspace/${workspace.id}/tasks?limit=0`)
      .set('Authorization', token);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });

  test('reject invalid status query param', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);
    await makeTaskInWorkspace(workspace.id);

    const response = await request(server.server)
      .get(`/workspace/${workspace.id}/tasks?status=invalid`)
      .set('Authorization', token);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });

  test('reject invalid limit upper bound query param', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const workspace = await makeWorkspace(user.id);
    await makeTaskInWorkspace(workspace.id);

    const response = await request(server.server)
      .get(`/workspace/${workspace.id}/tasks?limit=101`)
      .set('Authorization', token);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
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
