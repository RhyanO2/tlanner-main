import { test, expect, describe, beforeEach } from 'vitest';
import request from 'supertest';

import { server } from '../app.js';
import { makeTask } from './factories/makeTask.js';
import { authenticateCreatedUser } from './factories/makeUser.js';
import { faker as f } from '@faker-js/faker';
import { priority } from '../database/schema.js';
import { makeHabit } from './factories/makeHabit.js';
import { cleanTestDatabase } from './helpers/db.helper.js';

describe('HabitEdit Tests', () => {
  beforeEach(async () => {
    await cleanTestDatabase();
  });
  test('Edit Habit giving HabitID in reqparams', async () => {
    await server.ready();

    const habit = await makeHabit();
    const { token } = await authenticateCreatedUser();

    const response = await request(server.server)
      .put(`/habit/${habit.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        name: f.lorem.text(),
        frequency: 'monthly',
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual;
  });

  test('Edit task giving wrong taskID', async () => {
    await server.ready();

    const habit = await makeHabit();
    const { token } = await authenticateCreatedUser();

    const response = await request(server.server)
      .put(`/habit/${habit.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        name: null,
        frequency: 'monthly',
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
