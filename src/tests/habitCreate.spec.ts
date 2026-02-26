import { test, expect, describe } from 'vitest';
import request from 'supertest';

import { server } from '../app.js';
import { faker as f } from '@faker-js/faker';
import { authenticateCreatedUser } from './factories/makeUser.js';
import { makeWorkspace } from './factories/makeUserWorkspace.js';

describe('Create habit routes TEST', () => {
  test('Create a habit', async () => {
    await server.ready(); // espera o servidor rodar

    const { token, user } = await authenticateCreatedUser();

    const response = await request(server.server)
      .post(`/habit`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        name: f.lorem.text(),
        frequency: 'daily',
        id_user: user.id,
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      habits: expect.any(Object),
    });
  });
  test('Create a habit - 400', async () => {
    await server.ready(); // espera o servidor rodar

    const { token, user } = await authenticateCreatedUser(); 

    const response = await request(server.server)
      .post(`/habit`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        name: f.lorem.text(),
        frequency: 'daily',
        id_user: user,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
