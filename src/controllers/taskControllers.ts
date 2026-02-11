// import { taskPriority } from '../database/schema.ts';
import {
  taskCreate,
  taskEdit,
  taskRemove,
  tasksGet,
  WorkspaceTasksGet,
} from '../services/taskServices';
import { type FastifyRequest, type FastifyReply } from 'fastify';

export async function getTaskByID(req: FastifyRequest, res: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const result = await tasksGet(id);
    res.status(200).send({
      tasks: result,
    });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function getWorkspaceTasks(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const { id } = req.params as { id: string };
    const result = await WorkspaceTasksGet(id);
    res.status(200).send({
      workspace: id,
      tasks: result,
    });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function postTask(req: FastifyRequest, res: FastifyReply) {
  const { workspaceID } = req.params as {
    workspaceID: string;
  };
  const { title, description, priority, due_date } = req.body as {
    title: string;
    description: string;
    due_date: string | null;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    workspaceID: string;
  };
  try {
    const task = await taskCreate(
      title,
      description,
      due_date,
      priority,
      workspaceID
    );
    res.status(201).send({ task: task });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function editTask(req: FastifyRequest, res: FastifyReply) {
  const { id } = req.params as { id: string };
  const { title, description, priority, status, due_date } = req.body as {
    title: string;
    description: string;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'done';
    due_date: string | null;
  };
  try {
    await taskEdit(title, description, priority, status, due_date, id);
    res.status(200).send({ message: 'Task edited!' });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function delTask(req: FastifyRequest, res: FastifyReply) {
  try {
    const { id } = req.params as { id: string };

    await taskRemove(id);

    res.status(204);
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}
