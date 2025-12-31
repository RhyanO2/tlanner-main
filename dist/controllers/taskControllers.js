// import { taskPriority } from '../database/schema.ts';
import { taskCreate, taskEdit, taskRemove, tasksGet, WorkspaceTasksGet, } from '../services/taskServices.js';
export async function getTaskByID(req, res) {
    try {
        const { id } = req.params;
        const result = await tasksGet(id);
        res.status(200).send({
            workspace: id,
            tasks: result,
        });
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
export async function getWorkspaceTasks(req, res) {
    try {
        const { id } = req.params;
        const result = await WorkspaceTasksGet(id);
        res.status(200).send({
            workspace: id,
            tasks: result,
        });
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
export async function postTask(req, res) {
    const { workspaceID } = req.params;
    const { title, description, priority, due_date } = req.body;
    try {
        taskCreate(title, description, due_date, priority, workspaceID);
        res.status(201).send({ message: 'Task created!' });
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
export async function editTask(req, res) {
    const { id } = req.params;
    const { title, description, priority, status, due_date } = req.body;
    try {
        await taskEdit(title, description, priority, status, due_date, id);
        res.status(200).send({ message: 'Task edited!' });
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
export async function delTask(req, res) {
    try {
        const { id } = req.params;
        await taskRemove(id);
        res.status(200).send({ message: 'Task deleted!' });
    }
    catch (err) {
        res.status(err.statuscode || 400).send({
            message: err.message,
        });
    }
}
