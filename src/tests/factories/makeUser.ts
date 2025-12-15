import { Users } from "../../database/schema.ts";
import {fakerPT_BR as f } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { db } from "../../database/index.ts";
import { hash } from "argon2";
import { randomUUID } from "node:crypto";


export async function makeUser() {
  const password = randomUUID()

  const user = await db.insert(Users).values({
    name: f.person.firstName(),
    email: f.internet.email(),
    password: await hash(password)

  }).returning()

  return{
    user: user[0], //Retorna o usuário criado
    password // Retorna a senha antes do hash do usuário criado

  }
  
}

export async function authenticateCreatedUser() {
  const {user} = await makeUser()

  if(!process.env.JWT_SECRET){
    throw new Error('JWT_SECRET is required.')
  }

  const token = jwt.sign({sub: user.id},process.env.JWT_SECRET)

  return{user,token}
}