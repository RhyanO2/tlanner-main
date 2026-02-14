import {
  deleteCache,
  deleteCacheByPattern,
  getCache,
  setCache,
} from '../cache/cacheUtils.js';
import { AppError } from '../errors/AppError.js';

import {
  selectUserWorkspaces,
  selectWorkspaceById,
  insertWorkspace,
  updateWorkspaceTitle,
  removeWorkspace,
} from '../models/workspaceModel.js';

export async function userWorkspacesGet(userID: string) {
  const cacheKey = `workspaces:user:${userID}`;

  const cached = await getCache<{ workspaces: typeof workspaces }>(cacheKey);

  if (cached) return cached;

  const workspaces = await selectUserWorkspaces(userID);

  if (workspaces.length === 0) {
    throw new AppError('User do not have workspaces yet', 404);
  }
  const result = { workspaces };
  await setCache(cacheKey, result, 300);

  return result;
}

export async function WorkspaceGet(workspaceID: string) {
  const cacheKey = `workspace:${workspaceID}`;

  const cached = await getCache<typeof workspace>(cacheKey);
  if (cached) return cached;
  const workspace = await selectWorkspaceById(workspaceID);

  if (workspace.length === 0) {
    throw new AppError(`${workspaceID} workspace cannot be founded`, 404);
  }
  await setCache(cacheKey, workspace, 300);
  return workspace;
}

export async function WorkspaceCreate(title: string, userID: string) {
  const createWorkspace = await insertWorkspace(title, userID);
  await deleteCache(`workspaces:user${createWorkspace.id_user}`);
  return createWorkspace;
}

export async function WorkspaceEdit(title: string, workspaceID: string) {
  const editWorkspace = await updateWorkspaceTitle(title, workspaceID);

  await deleteCache(`workspaces:${workspaceID}`);

  await deleteCache(`workspaces:user:${editWorkspace.id_user}`);

  return editWorkspace;
}

export async function WorkspaceDelete(workspaceID: string) {
  const workspace = await selectWorkspaceById(workspaceID);

  if (workspace.length === 0) {
    throw new AppError(`(${workspaceID}) workspace cannot be founded`, 404);
  }

  const deleteWorkspace = await removeWorkspace(workspaceID);

  await deleteCache(`workspace:${workspaceID}`);

  // Remove o cache dos workspaces do usuário
  await deleteCache(`workspaces:user:${workspace[0].id_user}`);

  // Remove as tasks cacheadas desse workspace (cascade!)
  await deleteCacheByPattern(`tasks:workspace:${workspaceID}`);

  return deleteWorkspace;
}
