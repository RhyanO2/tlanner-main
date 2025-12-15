import {test,expect} from 'vitest';
import request from 'supertest';
import {server} from '../app.ts';
import { makeUser } from './factories/makeUser.ts';


test('Login parsing email and password',async()=>{
  await server.ready()

  const {user,password} = await makeUser()

  const response = await request(server.server).post('/login').set('Content-Type', 'application/json').send({
    email:user.email,
    password: password

  })


  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    message: 'Acess granted!',
    token: expect.any(String)
  })
})