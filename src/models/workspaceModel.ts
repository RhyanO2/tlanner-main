import { db } from '../database/index.ts';
import { Workspace } from '../database/schema.ts';
import { eq } from 'drizzle-orm';

export async function selectUserWorkspaces(userID: string) {
  return await db.select().from(Workspace).where(eq(Workspace.id_user, userID));
}

export async function selectWorkspaceById(workspaceID: string) {
  const workspace = await db
    .select()
    .from(Workspace)
    .where(eq(Workspace.id, workspaceID));
  return workspace;
}

export async function insertWorkspace(title: string, userID: string) {
  const InsertWorkspace = await db
    .insert(Workspace)
    .values({
      title: title,
      id_user: userID,
    })
    .returning();

  return InsertWorkspace[0];
}

export async function updateWorkspaceTitle(title: string, workspaceID: string) {
  const InsertWorkspace = await db
    .update(Workspace)
    .set({
      title: title,
    })
    .where(eq(Workspace.id, workspaceID))
    .returning();

  return InsertWorkspace[0];
}

export async function removeWorkspace(workspaceID: string) {
  const workspace = await db
    .delete(Workspace)
    .where(eq(Workspace.id, workspaceID))
    .returning();
  return workspace[0];
}
