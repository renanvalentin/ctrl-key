export interface Item {}

export class Wallet implements Item {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly balance: string,
    readonly marketPrice: string,
    readonly currency: string = 'USD',
  ) {}
}

export class CallToAction implements Item {}

export interface Tx {
  type: 'received' | 'withdrawal' | 'pending';
  amount: string;
  fees?: string;
  date: string;
  id: string;
}
