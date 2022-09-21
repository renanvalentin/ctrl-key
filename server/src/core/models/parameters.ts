interface Props {
  readonly epoch: number;
  readonly minFeeA: string;
  readonly minFeeB: string;
  readonly minUtxo: string;
  readonly poolDeposit: string;
  readonly keyDeposit: string;
  readonly coinsPerUtxoWord: string;
  readonly maxValSize: number;
  readonly priceMem?: number;
  readonly priceStep?: number;
  readonly maxTxSize: number;
}

export interface ParametersModel extends Props {}

export class Parameters implements ParametersModel {
  readonly epoch: number;
  readonly minFeeA: string;
  readonly minFeeB: string;
  readonly minUtxo: string;
  readonly poolDeposit: string;
  readonly keyDeposit: string;
  readonly coinsPerUtxoWord: string;
  readonly maxValSize: number;
  readonly priceMem?: number;
  readonly priceStep?: number;
  readonly maxTxSize: number;

  constructor(p: Props) {
    this.epoch = p.epoch;
    this.minFeeA = p.minFeeA;
    this.minFeeB = p.minFeeB;
    this.coinsPerUtxoWord = p.coinsPerUtxoWord;
    this.keyDeposit = p.keyDeposit;
    this.minUtxo = p.minUtxo;
    this.poolDeposit = p.poolDeposit;
    this.maxValSize = p.maxValSize;
    this.priceMem = p.priceMem;
    this.maxTxSize = p.maxTxSize;
    this.priceStep = p.priceStep;
  }
}
