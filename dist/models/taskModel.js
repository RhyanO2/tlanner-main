import { Tasks } from '../database/schema.js';
import { db } from '../database/index.js';
import { eq } from 'drizzle-orm';
export async function taskSelectByID(taskID) {
    return await db
        .select({
        taskID: Tasks.id,
        title: Tasks.title,
        status: Tasks.status,
        priority: Tasks.priority,
        description: Tasks.description,
        workspaceRelated: Tasks.id_workspace,
    })
        .from(Tasks)
        .where(eq(Tasks.id, taskID));
}
export async function taskSelectById(taskId) {
    return await db
        .select({
        taskID: Tasks.id,
        title: Tasks.title,
        status: Tasks.status,
        priority: Tasks.priority,
        description: Tasks.description,
        workspaceRelated: Tasks.id_workspace,
    })
        .from(Tasks)
        .where(eq(Tasks.id, taskId));
}
export async function selectTasksByWorkspaceId(workspaceID) {
    const workspace = await db
        .select()
        .from(Tasks)
        .where(eq(Tasks.id_workspace, workspaceID));
    return workspace;
}
export async function taskInsert(title, description, date, priority, workspaceID) {
    const insertedTask = await db
        .insert(Tasks)
        .values([
        {
            title: title,
            description: description,
            due_date: date,
            priority: priority,
            id_workspace: workspaceID,
        },
    ])
        .returning();
    return insertedTask[0];
}
export async function taskUpdate(title, description, status, priority, due_date, taskId) {
    const updatedTask = await db
        .update(Tasks)
        .set({
        title: title,
        description: description,
        status: status,
        priority: priority,
        due_date: due_date,
    })
        .where(eq(Tasks.id, taskId))
        .returning();
    return updatedTask[0];
}
export async function taskDelete(taskId) {
    const deletedTask = await db
        .delete(Tasks)
        .where(eq(Tasks.id, taskId))
        .returning();
    return deletedTask[0];
}
