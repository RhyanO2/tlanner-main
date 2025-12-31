import { test, expect, describe } from 'vitest';
import request from 'supertest';
import { server } from '../app.js';
import { makeTask } from './factories/makeTask.js';
import { authenticateCreatedUser } from './factories/makeUser.js';
import { faker as f } from '@faker-js/faker';
import { priority } from '../database/schema.js';

describe('TaskEdit Tests', () => {
  test('Edit task giving taskID in reqparams', async () => {
    await server.ready();

    const task = await makeTask();
    const { token } = await authenticateCreatedUser();

    const response = await request(server.server)
      .put(`/task/${task.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        title: f.lorem.words(2),
        description: f.lorem.words(2),
        status: 'in_progress',
        priority: 'low',
        due_date: f.date.future(),
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual;
  });

  test('Edit task giving wrong taskID', async () => {
    await server.ready();

    const task = f.string.uuid();
    const { token } = await authenticateCreatedUser();

    const response = await request(server.server)
      .put(`/tasks/${task}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        title: f.lorem.words(2),
        description: f.lorem.words(2),
        status: 'in_progress',
        due_date: f.date.future(),
      });

    expect(response.status).toEqual(404);
    expect(response.body).toEqual;
  });

  test('Edit task giving taskID in reqparams', async () => {
    await server.ready();

    const task = 'string';
    const { token } = await authenticateCreatedUser();

    const response = await request(server.server)
      .put(`/task/${task}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        title: f.lorem.words(2),
        description: f.lorem.words(2),
        status: 'in_progress',
        due_date: f.date.future(),
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual;
  });
});
