import { Subject } from 'rxjs';

export type Tx = string;

export class PendingTxs {
  private txs$: Subject<Tx>;

  constructor(txs$: Subject<Tx>) {
    this.txs$ = txs$;
  }

  public add(hash: string) {
    this.txs$.next(hash);
  }
}
