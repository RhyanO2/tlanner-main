import { test, expect, describe } from 'vitest';
import request from 'supertest';

import { server } from '../app.js';
import { faker as f } from '@faker-js/faker';
import { authenticateCreatedUser } from './factories/makeUser.js';
import { makeWorkspace } from './factories/makeUserWorkspace.js';

describe('Create task routes TEST', () => {
  test('Create a task', async () => {
    await server.ready(); // espera o servidor rodar

    const { token, user } = await authenticateCreatedUser(); // retorna usuario criado e token de auth, //utiliza o token retornado como object como string para funcionar na response

    const workspaceID = (await makeWorkspace(user.id)).id;
    const date = new Date(f.date.future());
    console.log(date);

    const response = await request(server.server)
      .post(`/workspace/${workspaceID}/tasks`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        title: f.lorem.text(),
        description: f.lorem.text(),
        due_date: null,
        priority: 'low',
        // workspaceID: workspaceID,
      });

    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      task: expect.any(Object),
    });
  });

  test('Create a task', async () => {
    await server.ready(); // espera o servidor rodar

    const { token, user } = await authenticateCreatedUser(); // retorna usuario criado e token de auth, //utiliza o token retornado como object como string para funcionar na response

    const workspaceID = (await makeWorkspace(user.id)).id;
    const date = new Date(f.date.future());

    const response = await request(server.server)
      .post(`/workspace/${workspaceID}/tasks`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .send({
        title: f.lorem.text(),

        description: f.lorem.text(),
        due_date: date,
        priority: 'low',
        // workspaceID: workspaceID,
      });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      message: expect.any(String),
    });
  });
});
