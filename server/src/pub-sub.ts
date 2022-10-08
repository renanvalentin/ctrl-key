import { createPubSub } from '@graphql-yoga/node';

export interface PendingTxPayload {
  hash: string;
}

export const pubSub = createPubSub<{
  'txs:pending:': [tx: string, payload: PendingTxPayload];
}>();
