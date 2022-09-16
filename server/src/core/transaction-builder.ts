import { CSL } from './cardano-serialization-lib';
import { TxValue } from './models';

interface BuildArgs {
  inputs: CSL.TransactionUnspentOutputs;
  output: CSL.TransactionOutput;
  config: CSL.TransactionBuilderConfig;
  changeAddress: CSL.Address;
}

export class TransactionBulder {
  static buildTx({ config, inputs, output, changeAddress }: BuildArgs) {
    const txBuilder = CSL.TransactionBuilder.new(config);

    txBuilder.add_output(output);
    txBuilder.set_ttl(410021);
    txBuilder.add_inputs_from(inputs, 1);
    txBuilder.add_change_if_needed(changeAddress);

    const txBody = txBuilder.build();

    return txBody;
  }

  static createConfig() {
    const linearFee = CSL.LinearFee.new(
      CSL.BigNum.from_str('44'),
      CSL.BigNum.from_str('155381'),
    );
    const txBuilderCfg = CSL.TransactionBuilderConfigBuilder.new()
      .fee_algo(linearFee)
      .pool_deposit(CSL.BigNum.from_str('500000000'))
      .key_deposit(CSL.BigNum.from_str('2000000'))
      .max_value_size(4000)
      .max_tx_size(8000)
      .coins_per_utxo_word(CSL.BigNum.from_str('34482'))
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
}
