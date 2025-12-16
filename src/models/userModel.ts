import { Users } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { eq } from 'drizzle-orm';

module.exports = {
  selectUser: async (email: string) => {
    const user = await db.select().from(Users).where(eq(Users.email, email));

    return user;
  },

  insertUser: async(name:string,email:string,password:string)=>{

    const insertedUser = await db.insert(Users).values({
              name: name,
              email: email,
              password: password
          }).returning()

      return insertedUser

  }

};
