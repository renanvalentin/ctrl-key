import { Subject } from 'rxjs';
import { accountDataLoader, coingeckoDataLoader } from './data-loaders';
import { PendingTxs, Tx } from './pending-txs';

export interface Context {
  accountDataLoader: ReturnType<typeof accountDataLoader>;
  coingeckoDataLoader: ReturnType<typeof coingeckoDataLoader>;
  pendingTxs: PendingTxs;
}

export const context =
  (pendingTxs: PendingTxs = new PendingTxs(new Subject<Tx>())) =>
  (): Context => {
    return {
      accountDataLoader: accountDataLoader(),
      coingeckoDataLoader: coingeckoDataLoader(),
      pendingTxs,
    };
  };
