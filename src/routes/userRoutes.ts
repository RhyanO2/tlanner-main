import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/index.ts";
import {Users} from "../database/schema.ts";
import { hash } from "argon2";


export const registerRoute: FastifyPluginAsyncZod = async(server)=> {
    server.post('./register',{

      schema:{

        summary: 'Register a user'
      }




    }, async(request,reply)=>{
      try{
        const {name,email,password} = request.body

        const hashed = hash(password)
        const createUser = await db.insert(Users).values({
        name:name,
        email:email,
        password:hashed
      }).returning()

      reply.status(201).send({Message:`User:${createUser[0].id} created with sucess`})
      }catch(err){
        
      }
      
    })
  },


}