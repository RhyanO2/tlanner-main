import { Users } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { eq } from 'drizzle-orm';

export async function selectUserByID(userId: string) {
  const user = await db.select().
  from(Users).
  where(eq(Users.id, userId));
  
  return user

}
export async function selectUserByEmail(email: string) {
  const user = await db.select().
  from(Users).
  where(eq(Users.email, email));
  
  return user

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

  return insertedUser[0];
}
