import { Tasks } from '../database/schema.js';
import { db } from '../database/index.js';

import { and, asc, desc, eq, sql } from 'drizzle-orm';

type TaskStatus = 'pending' | 'in_progress' | 'done';
type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';
type TaskSortBy = 'due_date' | 'priority' | 'status' | 'title';

type SelectTasksByWorkspaceOptions = {
  limit?: number;
  offset?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  sortBy?: TaskSortBy;
  sortOrder?: 'asc' | 'desc';
};

export async function taskSelectByID(taskID: string) {
  return await db
    .select({
      taskID: Tasks.id,
      title: Tasks.title,
      status: Tasks.status,
      priority: Tasks.priority,
      description: Tasks.description,
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

export async function selectTasksByWorkspaceId(
  workspaceID: string,
  options: SelectTasksByWorkspaceOptions = {}
) {
  const conditions = [eq(Tasks.id_workspace, workspaceID)];

  if (options.status) {
    conditions.push(eq(Tasks.status, options.status));
  }

  if (options.priority) {
    conditions.push(eq(Tasks.priority, options.priority));
  }

  const whereClause = and(...conditions);
  const sortBy = options.sortBy ?? 'due_date';
  const sortOrder = options.sortOrder ?? 'desc';

  const sortColumnMap = {
    due_date: Tasks.due_date,
    priority: Tasks.priority,
    status: Tasks.status,
    title: Tasks.title,
  } as const;

  let query = db
    .select({
      id: Tasks.id,
      title: Tasks.title,
      description: Tasks.description,
      priority: Tasks.priority,
      status: Tasks.status,
      due_date: Tasks.due_date,
      id_workspace: Tasks.id_workspace,
    })
    .from(Tasks)
    .where(whereClause)
    .orderBy(
      sortOrder === 'asc'
        ? asc(sortColumnMap[sortBy])
        : desc(sortColumnMap[sortBy])
    );

  if (typeof options.limit === 'number') {
    query = query.limit(options.limit).offset(options.offset ?? 0);
  }

  return await query;
}

export async function countTasksByWorkspaceId(
  workspaceID: string,
  options: Pick<SelectTasksByWorkspaceOptions, 'status' | 'priority'> = {}
) {
  const conditions = [eq(Tasks.id_workspace, workspaceID)];

  if (options.status) {
    conditions.push(eq(Tasks.status, options.status));
  }

  if (options.priority) {
    conditions.push(eq(Tasks.priority, options.priority));
  }

  const whereClause = and(...conditions);

  const result = await db
    .select({ total: sql<number>`count(*)` })
    .from(Tasks)
    .where(whereClause);

  return Number(result[0]?.total ?? 0);
}

export async function taskInsert(
  title: string,
  description: string,
  date: Date | null,
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
  due_date: Date | null,
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
