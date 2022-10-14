import debug from 'debug';
import { CSL } from './cardano-serialization-lib';
import { Parameters, TxValue } from './models';

const logger = debug('core:transaction-builder');

interface BuildArgs {
  inputs: CSL.TransactionUnspentOutputs;
  output: CSL.TransactionOutput;
  config: CSL.TransactionBuilderConfig;
  changeAddress: CSL.Address;
  ttl: number;
}

export class TransactionBulder {
  static buildTx({ config, inputs, output, changeAddress, ttl }: BuildArgs) {
    const txBuilder = CSL.TransactionBuilder.new(config);

    txBuilder.add_output(output);
    txBuilder.add_inputs_from(inputs, 1);
    txBuilder.set_ttl(ttl);
    txBuilder.add_change_if_needed(changeAddress);

    const txBody = txBuilder.build();

    return txBody;
  }

  static createConfig(parameters: Parameters) {
    logger('parameters', parameters);
    const linearFee = CSL.LinearFee.new(
      CSL.BigNum.from_str(parameters.minFeeA),
      CSL.BigNum.from_str(parameters.minFeeB),
    );
    const txBuilderCfg = CSL.TransactionBuilderConfigBuilder.new()
      .fee_algo(linearFee)
      .pool_deposit(CSL.BigNum.from_str(parameters.poolDeposit))
      .key_deposit(CSL.BigNum.from_str(parameters.keyDeposit))
      .max_value_size(parameters.maxValSize)
      .max_tx_size(parameters.maxTxSize)
      .coins_per_utxo_word(CSL.BigNum.from_str(parameters.coinsPerUtxoWord))
      .build();

    return txBuilderCfg;
  }

  static createTransactionUnspentOutputs(
    outputs: CSL.TransactionUnspentOutput[],
  ) {
    const utxoOutputs = CSL.TransactionUnspentOutputs.new();

    outputs.forEach(o => utxoOutputs.add(o));

    return utxoOutputs;
  }

  static createTransactionOutput(value: TxValue, paymentAddress: string) {
    return CSL.TransactionOutputBuilder.new()
      .with_address(CSL.Address.from_bech32(paymentAddress))
      .next()
      .with_value(value.toValue())
      .build();
  }

  static createChangeAddress(changeAddress: string) {
    return CSL.Address.from_bech32(changeAddress);
  }

  static getInputAddresses(
    inputs: CSL.TransactionInputs,
    utxos: CSL.TransactionUnspentOutput[],
  ): string[] {
    const getTxHash = (input: CSL.TransactionInput) =>
      Buffer.from(input.transaction_id().to_bytes()).toString('hex');

    const getAddr = (output: CSL.TransactionOutput) =>
      output.address().to_bech32();

    const hashIdxXAddrMap = utxos.reduce((acc, utxo) => {
      const txHash = getTxHash(utxo.input());
      const index = utxo.input().index();

      acc.set(`${txHash}:${index}`, getAddr(utxo.output()));

      return acc;
    }, new Map());

    const addrSet = new Set<string>();

    for (let i = 0; i < inputs.len(); i++) {
      const input = inputs.get(i);

      const txHash = getTxHash(input);
      const index = input.index();
      const key = `${txHash}:${index}`;

      if (hashIdxXAddrMap.has(key)) {
        addrSet.add(hashIdxXAddrMap.get(key));
      }
    }

    return Array.from(addrSet);
  }
}
