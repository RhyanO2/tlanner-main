import { Tasks } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { eq } from 'drizzle-orm';

module.exports = {
  taskSelect: async (userId: string) => {
    return await db
      .select({
        taskID: Tasks.id,
        title: Tasks.title,
        status: Tasks.status,
        description: Tasks.description,
        userRelated: Tasks.id_user,
      })
      .from(Tasks)
      .where(eq(Tasks.id_user, userId));
  },

  taskInsert: async (
    title: string,
    description: string,
    date: Date,
    userId: string
  ) => {
    const insertedTask = await db
      .insert(Tasks)
      .values([
        {
          title: title,
          description: description,
          due_date: date,
          id_user: userId,
        },
      ])
      .returning();

    return insertedTask[0];
  },

  taskUpdate: async (
    title: string,
    description: string,
    status: 'pending' | 'in_progress' | 'done',
    due_date: Date,
    taskId: string
  ) => {
    const updatedTask = await db
      .update(Tasks)
      .set({
        title: title,
        description: description,
        status: status,
        due_date: due_date,
      })
      .where(eq(Tasks.id, taskId))
      .returning();

    return updatedTask[0];
  },

  taskDelete: async (taskId: string) => {
    const deletedTask = await db
      .delete(Tasks)
      .where(eq(Tasks.id, taskId))
      .returning();

    return deletedTask;
  },
};
