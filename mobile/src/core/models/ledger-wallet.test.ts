import { LedgerWallet } from './ledger-wallet';

jest.mock('../cardano-serialization-lib', () => ({
  __esModule: true,
  ...require('../../__tests__/cardano-serialization-lib'),
}));

it('serialize wallet', async () => {
  const password = 'pass';

  const chainCodeHex =
    'bda8a3eb120ba26f5a5982742ee6a8b770520b0c4ad80bce403154ce7eb589d1';

  const publicKeyHex =
    '4b899d0cbbebeb6166a8ac3a71112e85e2db566facec0fdb502f38283c6fd56f';

  const wallet = await LedgerWallet.create({
    name: 'w',
    chainCodeHex,
    publicKeyHex,
    password,
  });

  const serializedWallet = await wallet.serialize();

  expect(serializedWallet).toEqual({
    __type: 'cold',
    id: expect.any(String),
    name: 'w',
    encryptedRootKey: expect.any(String),
    paymentVerificationKey:
      'xpub1qgxrzpz8zqy2t06g9a8xttv67gvhtsh2h4tzee6yegamf0ql4krju25yznlrfa6zrh8n3649r4q0w95slsz4nh8um50gwf58r3zke6cwhyrkl',
    stakeVerificationKey:
      'xpub1phnynfct9pg3zchv20vgr5cds4vjlxkmk67n8wc2cn957q9yyfg2sx047fnk0nwht8zujjfc5a9jnd3r50wtdx7wvu4dgjjp78td7uswv6r4e',
  });

  const {
    paymentAddresses,
    name,
    id,
    paymentVerificationKey,
    stakeVerificationKey,
    encryptedRootKey,
  } = await LedgerWallet.deserialize(serializedWallet);

  expect(wallet.paymentAddresses).toEqual(paymentAddresses);
  expect(wallet.paymentAddresses).toEqual(paymentAddresses);
  expect(wallet.paymentVerificationKey).toEqual(paymentVerificationKey);
  expect(wallet.stakeVerificationKey).toEqual(stakeVerificationKey);
  expect(wallet.name).toEqual(name);
  expect(wallet.id).toEqual(id);
  expect(wallet.encryptedRootKey).toEqual(encryptedRootKey);
});
