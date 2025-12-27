import 'dotenv/config';
import { server } from './app.ts';

server.listen({ port: 3000 }).then(() => {
  console.log(`3000`);
});
