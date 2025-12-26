// import { taskPriority } from '../database/schema.ts';
import {
  taskCreate,
  taskEdit,
  taskRemove,
  tasksGet,
} from '../services/taskServices.ts';
import { type FastifyRequest, type FastifyReply } from 'fastify';

export async function getTaskByWorkspaceID(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const { workspaceID } = req.params as { workspaceID: string };
    const result = await tasksGet(workspaceID);
    res.status(200).send({
      user: workspaceID,
      tasks: result,
    });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function postTask(req: FastifyRequest, res: FastifyReply) {
  const { workspaceID } = req.params as { workspaceID: string };
  const { title, description, priority, due_date } = req.body as {
    title: string;
    description: string;
    due_date: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
  };
  try {
    taskCreate(title, description, due_date, priority, workspaceID);
    res.status(201).send({ message: 'Task created!' });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function editTask(req: FastifyRequest, res: FastifyReply) {
  const { taskID } = req.params as { taskID: string };
  const { title, description, priority, status, due_date } = req.body as {
    title: string;
    description: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'done';
    due_date: string;
  };
  try {
    await taskEdit(title, description, priority, status, due_date, taskID);
    res.status(200).send({ message: 'Task edited!' });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function delTask(req: FastifyRequest, res: FastifyReply) {
  try {
    const { taskID } = req.params as { taskID: string };

    await taskRemove(taskID);

    res.status(200).send({ message: 'Task deleted!' });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}
