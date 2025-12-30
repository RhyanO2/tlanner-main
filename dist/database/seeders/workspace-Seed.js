import { db } from '../index.js';
import { Workspace } from '../schema.js';
import { faker as f } from '@faker-js/faker';
export default {
    createWorkspace: async (userID) => {
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
