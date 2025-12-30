import z from 'zod';
import { login } from '../controllers/userControllers.js';
export const loginRoute = async (server) => {
    server.post('/login', {
        schema: {
            summary: 'Login',
            body: z.object({
                email: z.string().email(),
                password: z.string(),
            }),
            response: {
                200: z.object({
                    message: z.string(),
                    token: z.string(),
                }),
                401: z.object({ message: z.string() }),
            },
        },
    }, login);
};
