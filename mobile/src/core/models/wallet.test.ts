import { Wallet } from './wallet';
import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';

jest.mock('../cardano-serialization-lib', () => ({
  __esModule: true,
  ...require('../../__tests__/cardano-serialization-lib'),
}));

it('serialize wallet', async () => {
  const password = 'pass';

  const seedWords = process.env.MNEMONIC;

  const name = 'w';

  const wallet = await Wallet.create({
    name,
    seedWords,
    password,
  });

  const serializedWallet = await wallet.serialize();

  const deserializedWallet = await Wallet.deserialize(serializedWallet);

  expect(wallet.paymentAddresses).toEqual(deserializedWallet.paymentAddresses);
});


it('sign tx', async () => {
  const salt = 'pass';

  const seedWords = process.env.MNEMONIC;

  const name = 'w';

  const wallet = await Wallet.create({
    name,
    seedWords,
    password: salt,
    salt,
  });

  const txHex =
    'a400818258202ac7d239675972200bc664576fee67e23eacb70ff5943f985b9f64d1ae82e19600018282583900faa9caf7e6129bad2e0444460a372df8069fcd3c45d256b75775393feb3e46c7d6757671dac59595da308218a269bba846787b5b3eac8d721a002dc6c0825839005f697c1763c12a954abef22ae9f31c81940918042888bafdd69310bceb3e46c7d6757671dac59595da308218a269bba846787b5b3eac8d721a05c588c3021a0002917d031a000641a5';

  const tx = await wallet.signTx(txHex, salt);

  const txBytes = await tx.to_bytes();

  expect(Transaction.from_bytes(txBytes).to_js_value()).toEqual({
    body: {
      inputs: [
        {
          transaction_id:
            '2ac7d239675972200bc664576fee67e23eacb70ff5943f985b9f64d1ae82e196',
          index: 0,
        },
      ],
      outputs: [
        {
          address:
            'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
          amount: {
            coin: '3000000',
            multiasset: null,
          },
          plutus_data: null,
          script_ref: null,
        },
        {
          address:
            'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
          amount: {
            coin: '96831683',
            multiasset: null,
          },
          plutus_data: null,
          script_ref: null,
        },
      ],
      fee: '168317',
      ttl: '410021',
      certs: null,
      withdrawals: null,
      update: null,
      auxiliary_data_hash: null,
      validity_start_interval: null,
      mint: null,
      script_data_hash: null,
      collateral: null,
      required_signers: null,
      network_id: null,
      collateral_return: null,
      total_collateral: null,
      reference_inputs: null,
    },
    witness_set: {
      vkeys: [
        {
          vkey: 'ed25519_pk158upnx4mxw2wh75vy34vmcmvvvv7ayj78skgtwk9z4we2u4fxlaq3nmlqw',
          signature:
            '0ddd53188bd5594015a061e99cb31e5fbd68c2e20aa85f0fbf64ab3aac980e090ddd618352f477c12466aa1ec81516e3afc6d277b424e8d32e7463054f6df903',
        },
      ],
      native_scripts: null,
      bootstraps: null,
      plutus_scripts: null,
      plutus_data: null,
      redeemers: null,
    },
    is_valid: true,
    auxiliary_data: null,
  });
});
