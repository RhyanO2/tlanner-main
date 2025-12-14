import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/index.ts";
import {Users} from "../database/schema.ts";
import { verify } from "argon2";
import z from "zod";
import {eq} from 'drizzle-orm';
import jwt from 'jsonwebtoken'


export const loginRoute: FastifyPluginAsyncZod = async (server)=>{

  server.post('/login',{
    schema:{
      summary: 'Login',
      body:z.object({
        email: z.email(),
        password: z.string()
      }),
      response: {
        200: z.object({
          message: z.string(),
          token: z.string()

        }),
        400: z.object({message: z.string()})
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

    if(!process.env.JWT_SECRET){
      throw new Error(`JWT_SECRET MUST BE SET.`);
    }
    const token = jwt.sign(`${Users.id}`,process.env.JWT_SECRET)

    reply.status(200).send({message: 'Acess granted!',
      token: token
    })

  })
}