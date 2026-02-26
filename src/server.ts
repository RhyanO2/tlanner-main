import 'dotenv/config';
import { server } from './app';
import { sdk } from '../src/config/openTelemetry.setup';

sdk.start();
const port = Number(process.env.SERVER_PORT);

server.listen({ port: port, host: '0.0.0.0' }).then(() => {
  console.log(`${port}`);
});
