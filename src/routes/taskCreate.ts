import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import {db} from '../database/index.ts'
import { Tasks } from '../database/schema.ts';
import z from 'zod'


export const createTask: FastifyPluginAsyncZod= async (server)=>{
  server.post('/tasks/:id',{
    schema:{
      summary:'Create a task',
      params:z.object({
        id: z.uuid()
      }),
      body: z.object({
        title: z.string(),
        description: z.string(),
        due_date: z.string()
      }),
      response:{
        201: z.object({
          message: z.string()
        })

      }
    }



  },async(request,reply)=>{

    const {title, description, due_date} = request.body;
    const userID = request.params.id;

    
    const date = new Date(due_date)
    

  

     const insert = await db.insert(Tasks).values([
          {
            title: title,
            description:  description,
            due_date: date,// ((((tipagem erro)))) padrão-drizzle
            id_user: userID,
          },
      ]).returning()

    reply.status(201).send({message: 'Task Created!'})

  })
}