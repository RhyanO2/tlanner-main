import { selectUser, insertUser } from '../models/userModel.ts'
import { hash, verify } from "argon2";
import jwt from 'jsonwebtoken'


export async function userRegister (name:string,email:string,password:string){

  const hashedPassword = await hash(password)

  const user = await insertUser(name,email,hashedPassword)



  return user[0]
}

export async function userLogin(email:string,password:string) {

  const userSelect = await selectUser(email)

  if(userSelect.length === 0){
    return [401,{message: 'Invalid credentials'}]
  }

  const user = userSelect[0]

  const matchPassword = await verify(user.password,password)

  if(!matchPassword){
    return [401,{message: 'Invalid credentials'}]
  }

   if(!process.env.JWT_SECRET){
      throw new Error(`JWT_SECRET MUST BE SET.`);
    }

  const token = jwt.sign({sub: user.id},process.env.JWT_SECRET)

  return [200,{message:'Acess granted!',token: token}]

}


