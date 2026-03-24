import {
  taskCreate,
  taskEdit,
  taskRemove,
  tasksGet,
  WorkspaceTasksGet,
} from '../services/taskServices';
import { type FastifyRequest, type FastifyReply } from 'fastify';
import { getUserIDFromRequest } from '../websocket/getUserFromToken';
import { emitToUser } from '../websocket/websocketManager';

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
    const { limit, offset, status, priority, sortBy, sortOrder } =
      req.query as {
        limit?: number;
        offset?: number;
        status?: 'pending' | 'in_progress' | 'done';
        priority?: 'low' | 'normal' | 'high' | 'urgent';
        sortBy?: 'due_date' | 'priority' | 'status' | 'title';
        sortOrder?: 'asc' | 'desc';
      };

    const result = await WorkspaceTasksGet(id, {
      limit,
      offset,
      status,
      priority,
      sortBy,
      sortOrder,
    });

    res.status(200).send({
      workspace: id,
      tasks: result.tasks,
      meta: {
        limit: result.limit,
        offset: result.offset,
        count: result.tasks.length,
        total: result.total,
      },
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

    //Buscando userID do token JWT
    const userID = getUserIDFromRequest(req.headers.authorization);
    //com o @userID é possivel avisar um usuário específico que foi criado uma task
    if (userID) {
      emitToUser(userID, {
        event: 'task:created',
        data: { task, workspaceID },
      });
    }

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
    const updatedTask = await taskEdit(
      title,
      description,
      priority,
      status,
      due_date,
      id
    );

    const userID = getUserIDFromRequest(req.headers.authorization);

    if (userID) {
      emitToUser(userID, {
        event: 'task:updated',
        data: { taskID: id, updatedTask },
      });
    }

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

    const userID = getUserIDFromRequest(req.headers.authorization);

    if (userID) {
      emitToUser(userID, {
        event: 'task:deleted',
        data: { taskID: id },
      });
    }

    res.status(204).send();
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}
