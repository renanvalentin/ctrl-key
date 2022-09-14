import { api } from '../blockfrost';
import { Address } from './address';

interface Props {
  readonly stakeAddress: string;
  readonly totalAvailable: bigint;
  readonly availableRewards: bigint;
}

export interface AccountModel extends Props {
  addresses(): Promise<Address[]>;
  balance: bigint;
}

export class Account implements AccountModel {
  readonly stakeAddress: string;
  readonly totalAvailable: bigint;
  readonly availableRewards: bigint;

  constructor({ stakeAddress, totalAvailable, availableRewards }: Props) {
    this.stakeAddress = stakeAddress;
    this.totalAvailable = totalAvailable;
    this.availableRewards = availableRewards;
  }

  async addresses(): Promise<Address[]> {
    const addresses = await api.accountsAddressesAll(this.stakeAddress);
    return addresses.map(({ address }) => new Address(address));
  }

  get balance() {
    return this.totalAvailable - this.availableRewards;
  }
}
