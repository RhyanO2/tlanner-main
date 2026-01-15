import {
  taskSelectByID,
  taskSelectById,
  taskInsert,
  taskUpdate,
  taskDelete,
  selectTasksByWorkspaceId,
} from '../models/taskModel.js';
// import { taskPriority } from '../database/schema.ts';
import { AppError } from '../errors/AppError.js';

export async function tasksGet(taskID: string) {
  const tasks = await taskSelectByID(taskID);

  if (tasks.length === 0) {
    throw new AppError(`Task ID${taskID} does not exists`, 404);
  }

  return tasks;
}

export async function WorkspaceTasksGet(workspaceID: string) {
  const tasks = await selectTasksByWorkspaceId(workspaceID);

  if (tasks.length === 0) {
    throw new AppError(
      'Cannot find tasks related to this user workspace yet. Create one at the upper button',
      404
    );
  }

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

  const createTask = taskInsert(
    title,
    description,
    realDate,
    priority,
    workspaceID
  );

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

  return taskUpdate(title, description, status, priority, realDate, taskId);
}

export async function taskRemove(taskId: string) {
  const task = await taskSelectById(taskId);

  console.log(task);
  if (task.length === 0) {
    throw new AppError('task cannot be find', 404);
  }

  return taskDelete(taskId);
}
