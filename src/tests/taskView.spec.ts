import { test, expect, describe } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { authenticateCreatedUser } from './factories/makeUser.ts';
import { faker } from '@faker-js/faker';
import { makeTask } from './factories/makeTaksUserID.ts';

describe('Task view', ()=>{

  test('View all tasks related to an user', async () => {
  await server.ready();
  

  const { token, user } = await authenticateCreatedUser();
  const task = await makeTask(user.id)

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
  test('View all tasks related to an user', async () => {
  await server.ready();

  const user = faker.string.uuid()
  const { token } = await authenticateCreatedUser();

  const response = await request(server.server)
    .get(`/tasks/${user}`)
    .set('Content-Type', 'application/json')
    .set('Authorization', token);

  expect(response.status).toEqual(404);
  expect(response.body).toEqual({
    message:'Cannot find task related to this user'
  });
});

})
