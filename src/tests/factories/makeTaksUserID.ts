import { faker as f } from '@faker-js/faker';
import { db } from '../../database/index.ts';
import { Tasks } from '../../database/schema.ts';
import { makeUser } from './makeUser.ts';

export async function makeTask(userid:string) {
  

  const Task = await db
    .insert(Tasks)
    .values({
      title: f.lorem.words(2),
      description: f.lorem.words(2),
      id_user: userid,
    })
    .returning();

  return Task[0];
}
