import http from "node:http";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { setupSocket } from "./services/socketService.js";

async function start() {
  await connectDatabase();
  const app = createApp();
  const server = http.createServer(app);
  const io = setupSocket(server);
  app.locals.io = io;

  server.listen(env.port, () => {
    process.stdout.write(`API online em http://localhost:${env.port}\n`);
    process.stdout.write(`Swagger em http://localhost:${env.port}/api/docs\n`);
  });
}

start().catch((error) => {
  process.stderr.write(`Falha ao iniciar servidor: ${error.message}\n`);
  process.exit(1);
});
