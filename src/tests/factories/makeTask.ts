import { faker as f } from '@faker-js/faker';
import { db } from '../../database/index.ts';
import { Tasks } from '../../database/schema.ts';
import { makeUser } from './makeUser.ts';
import { makeWorkspace } from './makeUserWorkspace.ts';

export async function makeTask() {
  const { user } = await makeUser();
  const workspace = await makeWorkspace(user.id);

  const Task = await db
    .insert(Tasks)
    .values({
      title: f.lorem.words(2),
      description: f.lorem.words(2),
      id_workspace: workspace.id,
    })
    .returning();

  return Task[0];
}
const task = (await makeTask()).id;

console.log(task);
