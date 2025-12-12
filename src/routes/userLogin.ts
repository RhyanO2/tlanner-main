import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/index.ts";
import {Users} from "../database/schema.ts";
import { verify } from "argon2";
import z from "zod";
import {eq} from 'drizzle-orm';


export const loginRoute: FastifyPluginAsyncZod = async (server)=>{

  server.post('/login',{
    schema:{
      summary: 'Login',
      body:z.object({
        email: z.email(),
        password: z.string()
      }),
      response: {
        200: z.object({message: 'Acess granted!'}),
        400: z.object({message: 'Invalid credentials.'})
      }
    },
    
    
  }, async(request,reply)=>{
    const {email,password} = request.body;

    const result = await db.select().from(Users).where(eq(Users.email,email))

    if(result.length === 0){
      reply.status(400).send({message:'Invalid credentials.'})
    }

    const user = result[0]

    const matchPassword = await verify(user.password, password)

    if(!matchPassword){
      reply.status(400).send({message: 'Invalid credentials.'})
    }

    reply.status(200).send({message: 'Acess granted!'})

  })


}