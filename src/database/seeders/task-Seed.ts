import { Tasks } from '../schema';
import { db } from '../index';

import { fakerPT_BR as f } from '@faker-js/faker';

export default {
  createTask: async (workspaceID: string) => {
    const taskTitle = f.lorem.words(2);
    const taskInsert = await db
      .insert(Tasks)
      .values([
        {
          title: taskTitle,
          description: `${taskTitle} ${f.lorem.paragraphs()}`,
          status: 'pending',
          due_date: new Date(),
          id_workspace: workspaceID,
        },
      ])
      .returning();
    return taskInsert;
  },
};
