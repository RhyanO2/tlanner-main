import z from 'zod';
import { checkRequestJWT } from './hooks/checkJWT-FromReq.js';
import { getTaskByID } from '../controllers/taskControllers.js';
export const getTasks = async (server) => {
    server.get('/task/:id', {
        preHandler: [checkRequestJWT],
        schema: {
            summary: 'Get tasks related to an user by ID',
            params: z.object({
                id: z.uuid(),
            }),
            // response: {
            //   200: z.object({
            //     user: z.string(),
            //     tasks: z.array(
            //       z.object({
            //         title: z.string(),
            //         status: z.enum(['pending', 'in_progress', 'done']),
            //         description: z.string(),
            //         userRelated: z.string(),
            //       })
            //     ),
            //   }),
            // },
        },
    }, getTaskByID);
};
