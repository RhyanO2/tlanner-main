import { db } from '../index.js';
import { Tasks } from '../schema.js';
import { fakerPT_BR as f } from '@faker-js/faker';
export default {
    createTask: async (workspaceID) => {
        const taskTitle = f.lorem.words(2);
        const taskInsert = await db
            .insert(Tasks)
            .values([
            {
                title: taskTitle,
                description: `${taskTitle} ${f.lorem.paragraphs()}`,
                status: 'pending',
                due_date: new Date(),
                id_workspace: workspaceID,
            },
        ])
            .returning();
        return taskInsert;
    },
};
