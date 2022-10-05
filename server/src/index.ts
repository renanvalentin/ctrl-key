const dotenv = require('dotenv');
dotenv.config();

import { createServer } from '@graphql-yoga/node';

import { schema } from './schema';
import { context } from './context';

async function main() {
  const server = createServer({ schema, context });
  await server.start();
}

main();
