import { test, expect, describe } from 'vitest';
import request from 'supertest';

import { server } from '../../app.js';
import { authenticateCreatedUser } from '../factories/makeUser.js';
import { makeTask } from '../factories/makeTask.js';

describe('Task delete responses', () => {
  test('Delete a created task from the database', async () => {
    await server.ready();

    const task = (await makeTask()).id;
    const { token } = await authenticateCreatedUser();

    const response = await request(server.server)
      .delete(`/task/${task}`)
      .set('Authorization', token);

    expect(response.status).toEqual(204);
  });
  test('unexistent ID', async () => {
    await server.ready();

    const task = '726cdcfb-04e0-4f0c-801e-db75d77c99d2';
    const { token } = await authenticateCreatedUser();

    const response = await request(server.server)
      .delete(`/task/${task}`)
      .set('Authorization', token);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
  test('Id not a string', async () => {
    await server.ready();

    const task = 'asas';
    const { token } = await authenticateCreatedUser();

    const response = await request(server.server)
      .delete(`/task/${task}`)
      .set('Authorization', token);

    expect(response.status).toEqual(400);
    expect(response.body).toEqual(expect.any(Object));
  });
});
