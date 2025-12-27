import { Tasks } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { eq } from 'drizzle-orm';

export async function taskSelectByID(taskID: string) {
  return await db
    .select({
      taskID: Tasks.id,
      title: Tasks.title,
      status: Tasks.status,
      priority: Tasks.priority,
      description: Tasks.description,
      workspaceRelated: Tasks.id_workspace,
    })
    .from(Tasks)
    .where(eq(Tasks.id, taskID));
}

export async function taskSelectById(taskId: string) {
  return await db
    .select({
      taskID: Tasks.id,
      title: Tasks.title,
      status: Tasks.status,
      priority: Tasks.priority,
      description: Tasks.description,
      workspaceRelated: Tasks.id_workspace,
    })
    .from(Tasks)
    .where(eq(Tasks.id, taskId));
}

export async function taskInsert(
  title: string,
  description: string,
  date: Date,
  priority: 'low' | 'normal' | 'high' | 'urgent',
  workspaceID: string
) {
  const insertedTask = await db
    .insert(Tasks)
    .values([
      {
        title: title,
        description: description,
        due_date: date,
        priority: priority,
        id_workspace: workspaceID,
      },
    ])
    .returning();

  return insertedTask[0];
}

export async function taskUpdate(
  title: string,
  description: string,
  status: 'pending' | 'in_progress' | 'done',
  priority: 'low' | 'normal' | 'high' | 'urgent',
  due_date: Date,
  taskId: string
) {
  const updatedTask = await db
    .update(Tasks)
    .set({
      title: title,
      description: description,
      status: status,
      priority: priority,
      due_date: due_date,
    })
    .where(eq(Tasks.id, taskId))
    .returning();

  return updatedTask[0];
}

export async function taskDelete(taskId: string) {
  const deletedTask = await db
    .delete(Tasks)
    .where(eq(Tasks.id, taskId))
    .returning();

  return deletedTask[0];
}
