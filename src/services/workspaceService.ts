import { AppError } from '../errors/AppError.ts';
import {
  selectUserWorkspaces,
  selectWorkspaceById,
  insertWorkspace,
  updateWorkspaceTitle,
  removeWorkspace,
} from '../models/workspaceModel.ts';

export async function userWorkspacesGet(userID: string) {
  const workspaces = await selectUserWorkspaces(userID);

  // if (workspaces.length === 0) {
  //   throw new AppError('User do not have workspaces yet', 404);
  // }

  return { workspaces };
}

export async function WorkspaceGet(workspaceID: string) {
  const workspace = await selectWorkspaceById(workspaceID);

  if (workspace.length === 0) {
    throw new AppError(`${workspaceID} workspace cannot be founded`);
  }

  return workspace;
}

export async function WorkspaceCreate(title: string, userID: string) {
  const createWorkspace = await insertWorkspace(title, userID);

  return createWorkspace;
}

export async function WorkspaceEdit(title: string, workspaceID: string) {
  const editWorkspace = await updateWorkspaceTitle(title, workspaceID);

  return editWorkspace;
}

export async function WorkspaceDelete(workspaceID: string) {
  const deleteWorkspace = await removeWorkspace(workspaceID);

  return deleteWorkspace;
}
