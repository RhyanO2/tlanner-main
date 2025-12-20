import {
  taskCreate,
  taskEdit,
  taskRemove,
  tasksGet,
} from '../services/taskServices.ts';
import { type FastifyRequest, type FastifyReply } from 'fastify';

export async function getTaskByUserID(req: FastifyRequest, res: FastifyReply) {
  const userId = req.params.id; // erro de tipagem TS
  try {
    const result = await tasksGet(userId);
    res.status(200).send({
      user: userId,
      tasks: result,
    });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function postTask(req: FastifyRequest, res: FastifyReply) {
  const userId = req.params.id;
  const { title, description, due_date } = req.body as {
    title: string;
    description: string;
    due_date: string;
  };
  try {
    taskCreate(title, description, due_date, userId);
    res.status(201).send({ message: 'Task created!' });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function editTask(req: FastifyRequest, res: FastifyReply) {
  const taskId = req.params.id;
  const { title, description, status, due_date } = req.body as {
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'done';
    due_date: string;
  };
  try {
    taskEdit(title, description, status, due_date, taskId);
    res.status(200).send({ message: 'Task edited!' });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function delTask(req: FastifyRequest, res: FastifyReply) {
  try {
    const taskId: string = req.params.id;

    taskRemove(taskId);

    res.status(200).send({ message: 'Task deleted!' });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}
