import {
  userWorkspacesGet,
  WorkspaceGet,
  WorkspaceCreate,
  WorkspaceEdit,
  WorkspaceDelete,
} from '../services/workspaceService.ts';
import { type FastifyRequest, type FastifyReply } from 'fastify';

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
    const results = WorkspaceCreate(title, id_user);
    res.status(200).send({ message: 'Workspace created' });
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
    const results = await WorkspaceEdit(title, id);

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
    const results = WorkspaceDelete(id);

    res.status(200).send({ message: 'Workspace deleted' });
  } catch (err: any) {
    res.status(err.statuscode || 400).send({
      message: err.message,
    });
  }
}
