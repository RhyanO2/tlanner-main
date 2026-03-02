import { test, expect, describe } from 'vitest';
import request from 'supertest';

import { server } from '../../app.js';

import { faker as f } from '@faker-js/faker';

import { vi } from 'vitest';

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
      verify: vi.fn().mockResolvedValue(true),
    }),
  },
}));

describe('User Register Tests', () => {
  (test('Register an user parsing bodyparams', async () => {
    await server.ready();

    const name = f.person.firstName();
    console.log(name);

    const email = f.internet.email({ provider: 'tlanner.com.br' });
    console.log(email);

    const password = 'Password1@';
    console.log(password);

    const response = await request(server.server)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        name: name,
        email: email,
        password: password,
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      User: expect.any(String),
    });
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
    }),
    test('Password lenght> 8', async () => {
      await server.ready();

      const response = await request(server.server)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send({
          name: f.person.firstName(),
          email: f.internet.email({ provider: 'tlanner.com.br' }),
          password: 'notvali',
        });

      expect(response.status).toEqual(400);
      expect(response.body).toEqual({
        message: expect.any(String),
      });
    }));
  test('Password not valid (just lowercase)', async () => {
    await server.ready();

    const response = await request(server.server)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        name: f.person.firstName(),
        email: f.internet.email({ provider: 'tlanner.com.br' }),
        password: 'notvalid',
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
  test('Password not valid (just uppercase)', async () => {
    await server.ready();

    const response = await request(server.server)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        name: f.person.firstName(),
        email: f.internet.email({ provider: 'tlanner.com.br' }),
        password: 'NOTV4LI#',
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
  test('Password not valid ( number)', async () => {
    await server.ready();

    const response = await request(server.server)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        name: f.person.firstName(),
        email: f.internet.email({ provider: 'tlanner.com.br' }),
        password: '1232133',
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
  test('Password not valid (just esp. char)', async () => {
    await server.ready();

    const response = await request(server.server)
      .post('/register')
      .set('Content-Type', 'application/json')
      .send({
        name: f.person.firstName(),
        email: f.internet.email({ provider: 'tlanner.com.br' }),
        password: '@#$',
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
