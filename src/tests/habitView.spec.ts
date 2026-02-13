import { test, expect, describe, beforeEach } from 'vitest';
import request from 'supertest';

import { server } from '../app.js';
import { authenticateCreatedUser } from './factories/makeUser.js';
import { faker } from '@faker-js/faker';
import { makeTaskInWorkspace } from './factories/makeTaskWorkspaceID.js';
import { makeWorkspace } from './factories/makeUserWorkspace.js';
import { makeHabit } from './factories/makeHabit.js';
import { cleanTestDatabase } from './helpers/db.helper.js';

describe('Habit view', () => {
   beforeEach(async () => {
    await cleanTestDatabase();
  });
  test('View information from a Habit', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();
    const habit = await makeHabit(user.id);

    const response = await request(server.server)
      .get(`/user/${user.id}/habits`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      user: habit.id_user,
      habits: expect.any(Object),
    });
  });
  test('cannot find Habit', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();

    const response = await request(server.server)
      .get(`/user/${user.id}/habits`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
