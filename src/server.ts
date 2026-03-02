import 'dotenv/config';
import { server } from './app';
import { sdk } from './config/openTelemetry.setup';
import { startEmailWorker } from './queue/workers/emailWorker';

sdk.start();
startEmailWorker();
const port = Number(process.env.SERVER_PORT);

server.listen({ port: port, host: '0.0.0.0' }).then(() => {
  console.log(`${port}`);
});
