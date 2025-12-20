import { test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { authenticateCreatedUser } from './factories/makeUser.ts';

test('View all tasks related to an user', async () => {
  await server.ready();

  const { token, user } = await authenticateCreatedUser();

  const response = await request(server.server)
    .get(`/tasks/${user.id}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token);

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    user: user.id,
    tasks: expect.any(Array),
  });
});
