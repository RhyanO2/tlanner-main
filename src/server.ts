import { server } from './app.ts';

server.listen({ port: 3000 }).then(() => {
  console.log(`RUNNING IN (--3000--)`);
});
