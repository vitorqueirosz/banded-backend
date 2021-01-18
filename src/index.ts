import dotenv from 'dotenv';
import { SetupServer } from './server';

dotenv.config();

(async () => {
  const server = new SetupServer(process.env.APP_PORT);
  await server.init();
  server.start();
})();
