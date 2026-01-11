import { test, expect, describe } from 'vitest';
import request from 'supertest';

import { server } from '../app.js';

import { faker as f } from '@faker-js/faker';

describe('User Register Tests', async() => {
  test('Register an user parsing bodyparams', async () => {
    await server.ready();

    const response = await request(server.server)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        name: f.person.firstName(),
        email: f.internet.email({ provider: 'tlanner.com.br' }),
        password: f.internet.password(),
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      User: expect.any(String),
    });
    console.log(response.body);
  }),
    test('Email not valid', async () => {
      await server.ready();

      const response = await request(server.server)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send({
          name: f.person.firstName(),
          email: f.person.firstName(),
          password: f.lorem.word(),
        });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        message: expect.any(String),
      });
    });
});
