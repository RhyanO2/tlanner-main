import {
  countTasksByWorkspaceId,
  taskSelectByID,
  taskSelectById,
  taskInsert,
  taskUpdate,
  taskDelete,
  selectTasksByWorkspaceId,
} from '../models/taskModel.js';
import { AppError } from '../errors/AppError.js';
import {
  deleteCache,
  deleteCacheByPattern,
  getCache,
  setCache,
} from '../cache/cacheUtils.js';

type WorkspaceTasksQuery = {
  limit?: number;
  offset?: number;
  status?: 'pending' | 'in_progress' | 'done';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  sortBy?: 'due_date' | 'priority' | 'status' | 'title';
  sortOrder?: 'asc' | 'desc';
};

function buildWorkspaceTasksCacheKey(
  workspaceID: string,
  query: WorkspaceTasksQuery
) {
  const suffix = [
    `limit:${query.limit ?? 'all'}`,
    `offset:${query.offset ?? 0}`,
    `status:${query.status ?? 'all'}`,
    `priority:${query.priority ?? 'all'}`,
    `sortBy:${query.sortBy ?? 'due_date'}`,
    `sortOrder:${query.sortOrder ?? 'desc'}`,
  ].join('|');

  return `tasks:workspace:${workspaceID}:${suffix}`;
}

export async function tasksGet(taskID: string) {
  const cacheKey = `task:${taskID}`;

  const cached = await getCache<
    Awaited<ReturnType<typeof taskSelectByID>>
  >(cacheKey);

  if (cached) {
    return cached;
  }
  const tasks = await taskSelectByID(taskID);

  if (tasks.length === 0) {
    throw new AppError(`Task ID${taskID} does not exists`, 404);
  }

  await setCache(cacheKey, tasks, 300);

  return tasks;
}

export async function WorkspaceTasksGet(
  workspaceID: string,
  query: WorkspaceTasksQuery = {}
) {
  const cacheKey = buildWorkspaceTasksCacheKey(workspaceID, query);

  const cached = await getCache<{
    tasks: Awaited<ReturnType<typeof selectTasksByWorkspaceId>>;
    total: number;
    limit: number | null;
    offset: number;
  }>(cacheKey);
  if (cached) return cached;

  const tasks = await selectTasksByWorkspaceId(workspaceID, query);
  const total = await countTasksByWorkspaceId(workspaceID, {
    status: query.status,
    priority: query.priority,
  });

  if (tasks.length === 0) {
    throw new AppError(
      'Cannot find tasks related to this user workspace yet. Create one at the upper button',
      404
    );
  }

  const payload = {
    tasks,
    total,
    limit: query.limit ?? null,
    offset: query.offset ?? 0,
  };

  await setCache(cacheKey, payload, 300);
  return payload;
}

export async function taskCreate(
  title: string,
  description: string,
  due_date: string | null,
  priority: 'low' | 'normal' | 'high' | 'urgent',
  workspaceID: string
) {
  const realDate = due_date ? new Date(`${due_date}T12:00:00`) : null;

  if (!description) {
    description = title;
  }

  const createTask = await taskInsert(
    title,
    description,
    realDate,
    priority,
    workspaceID
  );

  await deleteCacheByPattern(`tasks:workspace:${workspaceID}:*`);
  return createTask;
}

export async function taskEdit(
  title: string,
  description: string,
  priority: 'low' | 'normal' | 'high' | 'urgent',
  status: 'pending' | 'in_progress' | 'done',
  due_date: string | null,
  taskId: string
) {
  const task = await taskSelectById(taskId);

  if (task.length === 0) {
    throw new AppError('task cannot be find', 404);
  }

  const realDate = due_date ? new Date(`${due_date}T12:00:00`) : null;
  const updated = await taskUpdate(
    title,
    description,
    status,
    priority,
    realDate,
    taskId
  );
  await deleteCache(`task:${taskId}`);
  await deleteCacheByPattern(`tasks:workspace:${task[0].workspaceRelated}:*`);
  return updated;
}

export async function taskRemove(taskId: string) {
  const task = await taskSelectById(taskId);

  if (task.length === 0) {
    throw new AppError('task cannot be find', 404);
  }
  const deleted = await taskDelete(taskId);
  await deleteCache(`task:${taskId}`);
  await deleteCacheByPattern(`tasks:workspace:${task[0].workspaceRelated}:*`);
  return deleted;
}
