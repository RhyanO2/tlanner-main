import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import { DeleteWorkspace } from '../controllers/workspaceControllers.js';
export const WorkspaceDelete = async (server) => {
    server.delete('/workspace/:id', {
        preHandler: [checkRequestJWT],
        schema: {
            summary: 'Delete a workspace parsing ID',
            params: z.object({
                id: z.uuid(),
            }),
            response: {
                200: z.object({
                    message: z.string(),
                }),
            },
        },
    }, DeleteWorkspace);
};
