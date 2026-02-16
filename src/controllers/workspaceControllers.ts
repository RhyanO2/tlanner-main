import {
  userWorkspacesGet,
  WorkspaceGet,
  WorkspaceCreate,
  WorkspaceEdit,
  WorkspaceDelete,
} from '../services/workspaceService';
import { type FastifyRequest, type FastifyReply } from 'fastify';
import { emitToUser } from '../websocket/websocketManager';
import { getUserIDFromRequest } from '../websocket/getUserFromToken';

export async function getUserWorkspaces(
  req: FastifyRequest,
  res: FastifyReply
) {
  try {
    const { userID } = req.params as { userID: string };

    const results = await userWorkspacesGet(userID);
    res.status(200).send(results);
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function getWorkspaceByID(req: FastifyRequest, res: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const results = await WorkspaceGet(id);

    res.status(200).send({ results });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function PostWorkspace(req: FastifyRequest, res: FastifyReply) {
  try {
    const { title, id_user } = req.body as {
      title: string;
      id_user: string;
    };

    const workspace = await WorkspaceCreate(title, id_user);

    // UserID parseado como bodyparam, podendo ser utilizado sem precisar busca-lo nos headers
    emitToUser(id_user, {
      event: 'workspace:created',
      data: { workspace },
    });

    res.status(201).send({ workspace: workspace });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function PutWorkspace(req: FastifyRequest, res: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const { title } = req.body as {
      title: string;
    };
    const updatedWorkspace = await WorkspaceEdit(title, id);

    const userID = getUserIDFromRequest(req.headers.authorization);

    if (userID) {
      emitToUser(userID, {
        event: 'workspace:updated',
        data: { workspaceId: id, title },
      });
    }
    res.status(200).send({ message: 'Workspace edited' });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}

export async function DeleteWorkspace(req: FastifyRequest, res: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const userID = getUserIDFromRequest(req.headers.authorization);

    const results = await WorkspaceDelete(id);

    if (userID) {
      emitToUser(userID, {
        event: 'workspace:delete',
        data: { workspaceId: id },
      });
    }
    res.status(204).send();
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}
