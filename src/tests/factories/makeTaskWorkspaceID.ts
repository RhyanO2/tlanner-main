import { faker as f } from '@faker-js/faker';
import { db } from '../../database/index.ts';
import { Tasks } from '../../database/schema.ts';
import { makeUser } from './makeUser.ts';

export async function makeTaskInWorkspace(workspaceID: string) {
  const Task = await db
    .insert(Tasks)
    .values({
      title: f.lorem.words(2),
      description: f.lorem.words(2),
      id_workspace: workspaceID,
    })
    .returning();

  return Task[0];
}

// console.log(await makeTask('941008e5-2576-4d88-8762-da56ebb10d3d'));
