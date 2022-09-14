import BigNumber from 'bignumber.js';
import { Wallet } from '@ctrlK/core';
import { format, fromUnixTime } from 'date-fns';
import { TxDirection, Wallet as WalletSchema } from '@ctrl-k/schema';

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

const displayUnit = (value: string, decimals = 6) => {
  return Number(value) / 10 ** decimals;
};

const toADA = (value: string): string =>
  new BigNumber(displayUnit(value)).toFormat(6) + ' ' + 'ADA';

export class WalletViewModel {
  static summary(name: string, data: WalletSchema): Summary {
    return {
      name,
      marketPrice: data.marketPrice + ' USD',
      balance: toADA(data.balance),
      txs: data.txs.map(tx => ({
        type: tx.type === TxDirection.Incoming ? 'received' : 'withdrawal',
        amount: toADA(tx.amount),
        fees: tx.fees ? toADA(tx.fees) : undefined,
        id: tx.id,
        date: format(fromUnixTime(tx.date), 'yyyy/MM/dd hh:mm:ss a'),
      })),
    };
  }

  static validateMnemonic(mnemonic: string): boolean {
    return Wallet.validateMnemonic(mnemonic);
  }
}
