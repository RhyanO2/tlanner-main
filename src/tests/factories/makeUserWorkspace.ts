import { Workspace } from '../../database/schema.ts';
import { faker as f } from '@faker-js/faker';
import { db } from '../../database/index.ts';
import { makeUser } from '../factories/makeUser.ts';

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
