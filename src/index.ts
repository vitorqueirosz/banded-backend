import { SetupServer } from './server';

(async () => {
  const server = new SetupServer(process.env.APP_PORT);
  await server.init();
  server.start();
})();
