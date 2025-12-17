import { Users } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { eq } from 'drizzle-orm';

export async function selectUser(email: string) {
  
  return await db.select().
  from(Users).
  where(eq(Users.email, email));

}

export async function insertUser(
  name: string,
  email: string,
  password: string
) {
  const insertedUser = await db
    .insert(Users)
    .values({
      name: name,
      email: email,
      password: password,
    })
    .returning();

  return insertedUser;
}
