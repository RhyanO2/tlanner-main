import {test,expect} from 'vitest'
import request from 'supertest'
import {server} from '../app.ts'
import { authenticateCreatedUser } from './factories/makeUser.ts'
import { makeTask } from './factories/makeTask.ts'


test('Delete a created task from the database', async()=>{
  await server.ready()

  const task = (await makeTask()).id
  const {token} = await authenticateCreatedUser()

  const response = await request(server.server).delete(`/tasks/${task}`).set('Authorization',token)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    messaqe: expect.any(String)
  })
  

})