import 'dotenv/config';
import { server } from './app.js';
const port = Number(process.env.SERVER_PORT);
server.listen({ port: port }).then(() => {
    console.log(`${port}`);
});
