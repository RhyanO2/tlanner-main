import {
  taskSelectByWorkspace,
  taskSelectById,
  taskInsert,
  taskUpdate,
  taskDelete,
} from '../models/taskModel.ts';
// import { taskPriority } from '../database/schema.ts';
import { AppError } from '../errors/AppError.ts';

export async function tasksGet(workspaceID: string) {
  const tasks = await taskSelectByWorkspace(workspaceID);

  if (tasks.length === 0) {
    throw new AppError('Cannot find task related to this user workspace', 404);
  }

  return tasks;
}

export async function taskCreate(
  title: string,
  description: string,
  due_date: string,
  priority: 'low' | 'normal' | 'high' | 'urgent',
  workspaceID: string
) {
  const realDate = new Date(due_date);

  if (!description) {
    description = title;
  }

  const createTask = taskInsert(title, description, realDate, priority, workspaceID);

  return createTask;
}

export async function taskEdit(
  title: string,
  description: string,
  priority: 'low' | 'normal' | 'high' | 'urgent',
  status: 'pending' | 'in_progress' | 'done',
  due_date: string,
  taskId: string
) {
  const task = await taskSelectById(taskId);

  if (task.length === 0) {
    throw new AppError('task cannot be find', 404);
  }

  const realDate = new Date(due_date);

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
