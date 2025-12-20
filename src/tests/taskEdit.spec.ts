import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { makeTask } from './factories/makeTask.ts';
import { authenticateCreatedUser } from './factories/makeUser.ts';
import { faker as f } from '@faker-js/faker';

test('Edit task giving taskID in reqparams', async () => {
  await server.ready();

  const task = await makeTask();
  const { token } = await authenticateCreatedUser();

  const response = await request(server.server)
    .put(`/tasks/${task.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token)
    .send({
      title: f.lorem.words(2),
      description: f.lorem.words(2),
      status: 'in_progress',
      due_date: f.date.future(),
    });

  expect(response.status).toEqual(200);
  expect(response.body).toEqual;
});
