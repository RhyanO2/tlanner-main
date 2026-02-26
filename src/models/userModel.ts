import { Users } from '../database/schema.js';
import { db } from '../database/index.js';

import { eq } from 'drizzle-orm';


export async function selectUserByEmail(email: string) {
  const user = await db.select().from(Users).where(eq(Users.email, email));

  return user;
}

export async function insertUser(
  name: string,
  email: string,
  password?: string,
  provider?: 'LOCAL' | 'GITHUB' | 'GOOGLE'
) {
  if (provider) {
    const insertedUser = await db
      .insert(Users)
      .values({
        name: name,
        email: email,
        password: password,
        provider: provider,
      })
      .returning();

    return insertedUser[0];
  } else {
    const insertedUser = await db
      .insert(Users)
      .values({
        name: name,
        email: email,
        password: password,
        provider: provider,
      })
      .returning();

    return insertedUser[0];
  }
}
