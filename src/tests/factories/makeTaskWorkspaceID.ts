import { faker as f } from '@faker-js/faker';

import { db } from '../../database/index.js';
import { Tasks } from '../../database/schema.js';
import { makeUser } from './makeUser.js';

export async function makeTaskInWorkspace(workspaceID: string) {
  const Task = await db
    .insert(Tasks)
    .values({
      title: f.lorem.words(2),
      description: f.lorem.words(2),
      priority: 'normal',
      status: 'pending',
      due_date: f.date.future(),
      id_workspace: workspaceID,
    })
    .returning();

  return Task[0];
}
