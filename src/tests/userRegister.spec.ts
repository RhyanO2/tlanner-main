import {test,expect} from 'vitest';
import request from 'supertest';
import {server} from '../app.ts';
import { faker as f } from '@faker-js/faker';



test('Register an user parsing bodyparams',async()=>{
  await server.ready()

  const response = await request(server.server).post('/register').set('Content-Type','application/json').send({
    name:f.person.firstName(),
    email: f.internet.email(),
    password: f.lorem.word()
  })


  expect(response.status).toEqual(201)
  expect(response.body).toEqual({
    User: expect.any(String)

  })

})