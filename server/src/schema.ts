import { readFileSync } from 'node:fs';
import path from 'node:path';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { resolvers } from './resolvers';

const typeDefs = readFileSync(
  path.resolve(__dirname, './schema.graphql'),
  'utf8',
);

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefs],
});
