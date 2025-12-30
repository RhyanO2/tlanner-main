import { Workspace } from '../../database/schema';
import { faker as f } from '@faker-js/faker';
import { db } from '../../database/index';
import { makeUser } from '../factories/makeUser';

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
