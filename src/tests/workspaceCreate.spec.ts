import { describe, test, expect } from 'vitest';
import request from 'supertest';
import { server } from '../app.ts';
import { authenticateCreatedUser } from './factories/makeUser.ts';

import { faker as f } from '@faker-js/faker';

describe('Workspace Create', () => {
  test('Create user workspace', async () => {
    await server.ready();

    const { token, user } = await authenticateCreatedUser();

    const response = await request(server.server)
      .post(`/workspace`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        title: f.lorem.word(),
        id_user: user.id,
      });
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
