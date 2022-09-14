import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import { BLOCKFROST_API_TOKEN } from '@ctrl-k/config';
import { TxValue } from './cardano';

export const api = new BlockFrostAPI({
  projectId: BLOCKFROST_API_TOKEN as string,
  network: 'testnet',
});

interface Amount {
  unit: string;
  quantity: string;
}

export const amountToValue = (amount: Amount[]): TxValue => {
  const findLovelace = () => {
    const lovelace = amount.find(asset => asset.unit === 'lovelace');

    if (lovelace) {
      return BigInt(lovelace.quantity);
    }

    return 0n;
  };

  const findAssets = () => {
    return amount
      .filter(asset => asset.unit !== 'lovelace')
      .map(asset => ({
        hex: asset.unit,
        quantity: BigInt(asset.quantity),
      }));
  };

  return {
    lovelace: findLovelace(),
    assets: findAssets(),
  };
};
