import { api } from '../blockfrost';
import { Account, AccountModel } from './account';

export interface SerializedWallet {
  id: string;
  name: string;
  encryptedRootKey: string;
  paymentVerificationKey: string;
  stakeVerificationKey: string;
}

export interface WalletModel {
  readonly stakeAddress: string;
  account(): Promise<AccountModel>;
}

export interface CreateWalletArgs {
  stakeAddress: string;
}

interface WalletDeps {
  stakeAddress: string;
}

export class Wallet implements WalletModel {
  readonly stakeAddress: string;

  constructor({ stakeAddress }: WalletDeps) {
    this.stakeAddress = stakeAddress;
  }

  async account(): Promise<Account> {
    const account = await api.accounts(this.stakeAddress);
    return new Account({
      stakeAddress: account.stake_address,
      availableRewards: BigInt(account.withdrawable_amount),
      totalAvailable: BigInt(account.controlled_amount),
    });
  }
}
