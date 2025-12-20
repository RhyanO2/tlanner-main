import { db } from '../index.ts';
import { Tasks } from '../schema.ts';
import { fakerPT_BR as f } from '@faker-js/faker';
import { hash } from 'argon2';

export default {
  createTask: async (userid: string) => {
    const taskTitle = f.lorem.words(2);
    const taskInsert = await db
      .insert(Tasks)
      .values([
        {
          title: taskTitle,
          description: `${taskTitle} ${f.lorem.paragraphs()}`,
          status: 'pending',
          due_date: new Date(),
          id_user: userid,
        },
      ])
      .returning();
    return taskInsert;
  },
};
