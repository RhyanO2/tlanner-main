import { db } from '../index.ts';
import { Workspace } from '../schema.ts';
import { faker as f } from '@faker-js/faker';

export default {
  createWorkspace: async (userID: string) => {
    const workspaceTitle = f.lorem.word();
    const workspaceInsert = await db
      .insert(Workspace)
      .values([
        {
          title: workspaceTitle,
          id_user: userID,
        },
      ])
      .returning();

    return workspaceInsert;
  },
};
