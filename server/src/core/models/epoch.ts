import { Int } from '@emurgo/cardano-serialization-lib-nodejs';
import { api } from '../blockfrost';
import { Parameters, ParametersModel } from './parameters';

interface Props {
  readonly epoch: number;
  readonly startTime: number;
  readonly endTime: number;
  readonly firstBlockTime: number;
  readonly lastBlockTime: number;
  readonly blockTime: number;
  readonly txCount: number;
  readonly output: string;
  readonly fees: number;
  readonly activeStake?: number;
}

export interface EpochModel extends Props {
  paramters(): Promise<ParametersModel>;
}

export class Epoch implements EpochModel {
  readonly epoch: number;
  readonly startTime: number;
  readonly endTime: number;
  readonly firstBlockTime: number;
  readonly lastBlockTime: number;
  readonly blockTime: number;
  readonly txCount: number;
  readonly output: string;
  readonly fees: number;
  readonly activeStake?: number;

  constructor(params: Props) {
    this.epoch = params.epoch;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.firstBlockTime = params.firstBlockTime;
    this.lastBlockTime = params.lastBlockTime;
    this.blockTime = params.blockTime;
    this.txCount = params.txCount;
    this.output = params.output;
    this.fees = params.fees;
    this.activeStake = params.activeStake;
  }

  async paramters(): Promise<ParametersModel> {
    const p = await api.epochsParameters(this.epoch);
    return new Parameters({
      coinsPerUtxoWord:
        p.coins_per_utxo_size !== null ? p.coins_per_utxo_size : '34482',
      epoch: this.epoch,
      keyDeposit: p.key_deposit,
      maxTxSize: p.max_tx_size,
      maxValSize:
        p.max_val_size !== null
          ? parseInt(p.max_val_size)
          : Number.MAX_SAFE_INTEGER,
      minFeeA: p.min_fee_a.toString(),
      minFeeB: p.min_fee_b.toString(),
      minUtxo: p.min_utxo,
      poolDeposit: p.pool_deposit,
      priceMem: p.price_mem !== null ? p.price_mem : undefined,
      priceStep: p.price_step !== null ? p.price_step : undefined,
    });
  }

  static async latest(): Promise<EpochModel> {
    const epoch = await api.epochsLatest();
    return new Epoch({
      epoch: epoch.epoch,
      startTime: epoch.start_time,
      endTime: epoch.end_time,
      firstBlockTime: epoch.first_block_time,
      lastBlockTime: epoch.last_block_time,
      blockTime: epoch.block_count,
      txCount: epoch.tx_count,
      output: epoch.output,
      fees: parseInt(epoch.fees),
      // activeStake: epoch.active_stake && parseInt(epoch.active_stake),
    });
  }
}
