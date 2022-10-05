import { accountDataLoader, coingeckoDataLoader } from './data-loaders';

export interface Context {
  accountDataLoader: ReturnType<typeof accountDataLoader>;
  coingeckoDataLoader: ReturnType<typeof coingeckoDataLoader>;
}

export const context = (): Context => {
  return {
    accountDataLoader: accountDataLoader(),
    coingeckoDataLoader: coingeckoDataLoader(),
  };
};
