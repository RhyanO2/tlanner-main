import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import { getUserWorkspaces } from '../controllers/workspaceControllers.js';
export const userWorkspaces = async (server) => {
    server.get('/user/:userID/workspaces', {
        preHandler: [checkRequestJWT],
        schema: {
            summary: 'Get workspaces related to an user by ID',
            params: z.object({
                userID: z.uuid(),
            }),
            response: {
                200: z.object({
                    workspaces: z.array(z.object({
                        id: z.string(),
                        title: z.string(),
                        id_user: z.string(),
                    })),
                }),
            },
        },
    }, getUserWorkspaces);
};
