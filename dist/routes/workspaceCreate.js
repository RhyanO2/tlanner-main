import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import { PostWorkspace } from '../controllers/workspaceControllers.js';
export const WorkspacePost = async (server) => {
    server.post('/workspace', {
        preHandler: [checkRequestJWT],
        schema: {
            summary: 'Create a workspace parsind userid an title',
            body: z.object({
                title: z.string(),
                id_user: z.uuid(),
            }),
            response: {
                201: z.object({
                    message: z.string(),
                }),
            },
        },
    }, PostWorkspace);
};
