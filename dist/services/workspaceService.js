import { AppError } from '../errors/AppError.js';
import { selectUserWorkspaces, selectWorkspaceById, insertWorkspace, updateWorkspaceTitle, removeWorkspace, } from '../models/workspaceModel.js';
export async function userWorkspacesGet(userID) {
    const workspaces = await selectUserWorkspaces(userID);
    if (workspaces.length === 0) {
        throw new AppError('User do not have workspaces yet', 404);
    }
    return { workspaces };
}
export async function WorkspaceGet(workspaceID) {
    const workspace = await selectWorkspaceById(workspaceID);
    if (workspace.length === 0) {
        throw new AppError(`${workspaceID} workspace cannot be founded`, 404);
    }
    return workspace;
}
export async function WorkspaceCreate(title, userID) {
    const createWorkspace = await insertWorkspace(title, userID);
    return createWorkspace;
}
export async function WorkspaceEdit(title, workspaceID) {
    const editWorkspace = await updateWorkspaceTitle(title, workspaceID);
    return editWorkspace;
}
export async function WorkspaceDelete(workspaceID) {
    const workspace = await selectWorkspaceById(workspaceID);
    if (workspace.length === 0) {
        throw new AppError(`(${workspaceID}) workspace cannot be founded`, 404);
    }
    const deleteWorkspace = await removeWorkspace(workspaceID);
    return deleteWorkspace;
}
