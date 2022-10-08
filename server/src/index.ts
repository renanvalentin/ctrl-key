const dotenv = require('dotenv');
dotenv.config();

import { createServer } from './server';

async function main() {
  const server = await createServer();
  await server.start();
}

main();
