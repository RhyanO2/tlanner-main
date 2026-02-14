import {
  taskSelectByID,
  taskSelectById,
  taskInsert,
  taskUpdate,
  taskDelete,
  selectTasksByWorkspaceId,
} from '../models/taskModel.js';
import { AppError } from '../errors/AppError.js';
import { deleteCache, getCache, setCache } from '../cache/cacheUtils.js';

export async function tasksGet(taskID: string) {
  const cacheKey = `task:${taskID}`;

  const cached = await getCache<typeof tasks>(cacheKey);

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

export async function WorkspaceTasksGet(workspaceID: string) {
  const cacheKey = `tasks:workspace:${workspaceID}`;

  const cached = await getCache<typeof tasks>(cacheKey);
  if (cached) return cached;

  const tasks = await selectTasksByWorkspaceId(workspaceID);

  if (tasks.length === 0) {
    throw new AppError(
      'Cannot find tasks related to this user workspace yet. Create one at the upper button',
      404
    );
  }
  await setCache(cacheKey, tasks, 300);
  return tasks;
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

  await deleteCache(`tasks:workspace:${workspaceID}`);
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
  await deleteCache(`tasks:${taskId}`);
  await deleteCache(`tasks:workspace${task[0].workspaceRelated}`);
  return updated;
}

export async function taskRemove(taskId: string) {
  const task = await taskSelectById(taskId);

  if (task.length === 0) {
    throw new AppError('task cannot be find', 404);
  }
  const deleted = await taskDelete(taskId);
  await deleteCache(`tasks:${taskId}`);
  return deleted;
}
