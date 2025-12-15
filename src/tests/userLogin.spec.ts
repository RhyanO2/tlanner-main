import {test,expect,describe} from 'vitest';
import request from 'supertest';
import {server} from '../app.ts';
import { makeUser } from './factories/makeUser.ts';

describe('Login operations',()=>{
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

  test('parsing Wrong email in bodyParams',async()=>{
    await server.ready()

    const {user,password} = await makeUser()

    const response = await request(server.server).post('/login').set('Content-Type', 'application/json').send({
      email:'wrong@email.com',
      password: password

    })


    expect(response.status).toEqual(401)
    expect(response.body).toEqual({
      message: 'Invalid credentials.',
      
    })

    
  })
  test('parsing Wrong password in bodyParams',async()=>{
    await server.ready()

    const {user,password} = await makeUser()

    const response = await request(server.server).post('/login').set('Content-Type', 'application/json').send({
      email:user.email,
      password: 'wrong-password'

    })


    expect(response.status).toEqual(401)
    expect(response.body).toEqual({
      message: 'Invalid credentials.',
      
    })

    
  })
})
