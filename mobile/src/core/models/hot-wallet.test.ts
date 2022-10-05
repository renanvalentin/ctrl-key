import { HotWallet } from './hot-wallet';
import { Transaction } from '@emurgo/cardano-serialization-lib-nodejs';

jest.mock('../cardano-serialization-lib', () => ({
  __esModule: true,
  ...require('../../__tests__/cardano-serialization-lib'),
}));

it('serialize wallet', async () => {
  const password = 'pass';

  const seedWords = process.env.MNEMONIC;

  const wallet = await HotWallet.create({
    name: 'w',
    seedWords,
    password,
  });

  const serializedWallet = await wallet.serialize();

  expect(serializedWallet).toEqual({
    __type: 'hot',
    id: expect.any(String),
    name: 'w',
    encryptedRootKey: expect.any(String),
    paymentVerificationKey:
      'xpub1ha3hdtpzuyavyp4n8jmk37rd9df6yxsqrqjl0q9znx6mgytn44hugkegc76zfx5wwuk060x67dlft5vfndzdzgrh824w3tlu9m4pznccqd6xs',
    stakeVerificationKey:
      'xpub1cw5hv0ufyyrdj9aan28sqgdlws6kqv3u8texkny5692ur7wu2n2pe5xmjc6cxrew6mqugvnw2sevpkmp2drf6yjl0qvh2cgzy7r4r6c8hz0la',
  });

  const {
    paymentAddresses,
    name,
    id,
    paymentVerificationKey,
    stakeVerificationKey,
    encryptedRootKey,
  } = await HotWallet.deserialize(serializedWallet);

  expect(wallet.paymentAddresses).toEqual(paymentAddresses);
  expect(wallet.paymentVerificationKey).toEqual(paymentVerificationKey);
  expect(wallet.stakeVerificationKey).toEqual(stakeVerificationKey);
  expect(wallet.name).toEqual(name);
  expect(wallet.id).toEqual(id);
  expect(wallet.encryptedRootKey).toEqual(encryptedRootKey);
});

it('sign tx', async () => {
  const salt = '';
  const password = 'pass';

  const seedWords = process.env.MNEMONIC;

  const name = 'w';

  const wallet = await HotWallet.create({
    name,
    seedWords,
    password,
    salt,
  });

  const txHex =
    'a40081825820e7e9e5d74f2c5a00828cd1f638ec0991ea198d30a55c6fccb81f8ea32b425f040101828258390092613032ecc6c1c2cf451e752b0a222dd8a70370db79bdf4721cc70826a4f8878feff4878c22176dc43a93ba8af53c9b75124dadcf419cfa1a001e8480825839005f697c1763c12a954abef22ae9f31c81940918042888bafdd69310bceb3e46c7d6757671dac59595da308218a269bba846787b5b3eac8d72821a05629e81a1581c789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f1a1496861707079636f696e02021a0002990d031a04229435';

  const witnessesAddress = [
    'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
  ];

  const tx = await wallet.signTx(txHex, password, witnessesAddress);

  const txBytes = await tx.to_bytes();

  expect(Transaction.from_bytes(txBytes).to_js_value()).toEqual({
    body: {
      inputs: [
        {
          transaction_id:
            'e7e9e5d74f2c5a00828cd1f638ec0991ea198d30a55c6fccb81f8ea32b425f04',
          index: 1,
        },
      ],
      outputs: [
        {
          address:
            'addr_test1qzfxzvpjanrvrsk0g50822c2ygka3fcrwrdhn005wgwvwzpx5nug0rl07jrccgshdhzr4ya63t6nexm4zfx6mn6pnnaqgnscnz',
          amount: {
            coin: '2000000',
            multiasset: null,
          },
          plutus_data: null,
          script_ref: null,
        },
        {
          address:
            'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
          amount: {
            coin: '90349185',
            multiasset: {
              '789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f1': {
                '6861707079636f696e': '2',
              },
            },
          },
          plutus_data: null,
          script_ref: null,
        },
      ],
      fee: '170253',
      ttl: '69375029',
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
          vkey: 'ed25519_pk1ha3hdtpzuyavyp4n8jmk37rd9df6yxsqrqjl0q9znx6mgytn44hsukj73v',
          signature:
            '4852585ca64dcfa8d536a75c4d1b3b53964247c1f00be58bc6cb6aad9ed921358cbbe3d2d9ba19fe8653256234117c0750c8cf03fdf5478d1a6e7f434b8a0d02',
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
