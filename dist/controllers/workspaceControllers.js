import { userWorkspacesGet, WorkspaceGet, WorkspaceCreate, WorkspaceEdit, WorkspaceDelete, } from '../services/workspaceService.js';
export async function getUserWorkspaces(req, res) {
    try {
        const { userID } = req.params;
        const results = await userWorkspacesGet(userID);
        res.status(200).send(results);
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
export async function getWorkspaceByID(req, res) {
    try {
        const { id } = req.params;
        const results = await WorkspaceGet(id);
        res.status(200).send({ results });
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
export async function PostWorkspace(req, res) {
    try {
        const { title, id_user } = req.body;
        const results = WorkspaceCreate(title, id_user);
        res.status(201).send({ message: 'Workspace created' });
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
export async function PutWorkspace(req, res) {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const results = await WorkspaceEdit(title, id);
        res.status(200).send({ message: 'Workspace edited' });
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
export async function DeleteWorkspace(req, res) {
    try {
        const { id } = req.params;
        const results = await WorkspaceDelete(id);
        res.status(200).send({ message: 'Workspace deleted' });
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
