import { Serializable, toObject } from './serializable';

export interface Props {
  readonly id: string;
  readonly lovelace: string;
  readonly fees: string;
  readonly date: number;
}

export interface PendingTxModel
  extends Serializable<PendingTxModel, Props>,
    Props {}

export class PendingTx implements PendingTxModel {
  readonly id: string;
  readonly lovelace: string;
  readonly fees: string;
  readonly date: number;

  constructor({ date, fees, id, lovelace }: Props) {
    this.id = id;
    this.lovelace = lovelace;
    this.fees = fees;
    this.date = date;
  }

  serialize(): Props {
    return toObject<Props>({
      date: this.date,
      fees: this.fees,
      id: this.id,
      lovelace: this.lovelace,
    });
  }

  static deserialize(args: Props): PendingTxModel {
    return new PendingTx({ ...args });
  }
}
