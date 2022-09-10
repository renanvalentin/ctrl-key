import BigNumber from 'bignumber.js';
import { uniqWith, eqProps } from 'ramda';
import {
  WalletModel,
  AddressModel,
  TxDirections,
  Wallet,
  coingecko,
} from '@ctrlK/core';
import { format, fromUnixTime } from 'date-fns';

interface Tx {
  type: 'received' | 'withdrawal';
  amount: string;
  fees?: string;
  date: string;
  id: string;
}

interface Summary {
  name: string;
  balance: string;
  marketPrice: string;
  txs: Tx[];
}

BigNumber.config({
  FORMAT: {
    decimalSeparator: '.',
  },
});

const displayUnit = (value: bigint | number, decimals = 6) => {
  return Number(value) / 10 ** decimals;
};

const toADA = (value: bigint | number): string =>
  new BigNumber(displayUnit(value)).toFormat(6) + ' ' + 'ADA';

const getTxs = async (addresses: AddressModel[]) => {
  const txs = await (
    await Promise.all(addresses.map(addr => addr.transactions()))
  ).flatMap(tx => tx);

  return uniqWith(eqProps('hash'), txs);
};

export class WalletViewModel {
  static async summary(wallet: WalletModel): Promise<Summary> {
    const [account, price] = await Promise.all([
      wallet.account(),
      coingecko.price(),
    ]);

    const addresses = await account.addresses();

    const txs = await getTxs(addresses);

    const txViewRequests = txs.map(async tx => {
      const utxo = await tx.utxo();
      const direciton = utxo.direction(addresses);
      const amount = utxo.txValue(addresses);

      return {
        type: direciton === TxDirections.Incoming ? 'received' : 'withdrawal',
        amount: toADA(amount.lovelace),
        fees: direciton === TxDirections.Incoming ? undefined : toADA(tx.fees),
        date: format(fromUnixTime(tx.blockTime), 'yyyy/MM/dd hh:mm:ss a'),
        id: tx.hash,
      } as Tx;
    });

    const txsViews = await Promise.all(txViewRequests);

    return {
      name: wallet.name,
      balance: toADA(account.balance),
      marketPrice: price.cardano.usd + ' USD',
      txs: txsViews,
    };
  }

  static validateMnemonic(mnemonic: string): boolean {
    return Wallet.validateMnemonic(mnemonic);
  }
}
