const dotenv = require('dotenv');
dotenv.config();

import { createServer } from '@graphql-yoga/node';
import { ReplaySubject } from 'rxjs';

import { schema } from './schema';
import { context } from './context';

import { pubSub } from './pub-sub';
import { PendingTxs, Tx } from './pending-txs';

async function main() {
  const pendingTxs$ = new ReplaySubject<Tx>();
  const pendingTxs = new PendingTxs(pendingTxs$);

  pendingTxs$.subscribe(tx => {
    pubSub.publish('txs:pending:', tx, { hash: tx });
  });

  const server = createServer({ schema, context: context(pendingTxs) });
  await server.start();
}

main();
