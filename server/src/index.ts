const dotenv = require('dotenv');
dotenv.config();

import { createServer } from './server';
import { createWebhook } from './webhook';

async function main() {
  const server = await createServer();
  await server.start();

  const webhook = createWebhook();
  webhook.listen(6666, () => console.log('Running on port 6666'));
}

main();
