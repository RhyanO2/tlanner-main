
import { Workspace } from '../../database/schema.js';
import { faker as f } from '@faker-js/faker';
import { db } from '../../database/index.js';
import { makeUser } from '../factories/makeUser.js';

export async function makeWorkspace(userID: string) {
  const workspasce = await db
    .insert(Workspace)
    .values({
      title: f.lorem.word(),
      id_user: userID,
    })
    .returning();

  return workspasce[0];
}
