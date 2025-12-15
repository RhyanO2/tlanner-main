import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/index.ts";
import {Users} from "../database/schema.ts";
import { hash } from "argon2";
import z from "zod";


export const registerRoute: FastifyPluginAsyncZod = async(server)=> {
    server.post('/register',{

      schema:{

        summary: 'Register a user',
        body: z.object({
          name: z.string(),
          email: z.string(),
          password: z.string(),

        }),
        response: {
          201: z.object({User:z.string()})
        }
      },
    }, async(req,res)=>{
      try{
        const {name,email,password} = req.body

        const hashed = hash(password)
        const createUser = await db.insert(Users).values({
          name: name,
          email: email,
          password: await hashed
      }).returning()

      res.status(201).send({User:`${createUser[0].id} Created with sucess`})
      }catch(err){
        
      }
      
    })
}

