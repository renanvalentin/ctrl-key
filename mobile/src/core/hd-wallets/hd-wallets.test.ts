import * as addresses from './addresses';
import * as mnemonic from './mnemonic';
import * as seed from './seed';
import { bech32 } from 'bech32';

jest.mock('../cardano-serialization-lib', () => ({
  __esModule: true,
  ...require('../../__tests__/cardano-serialization-lib'),
}));

it('restore private key', async () => {
  const salt = 'password';

  const entropy = mnemonic.mnemonicToEntropy(
    'across angle sock very garbage link wine rally six hungry goat orphan tonight tube aim someone prosper fine glance phrase various stuff educate melody',
  );

  expect(entropy).toEqual(
    '02411b387975f9043ee58ac9cde9904e6e49d4015678ac8ad98ad1ef19af11a4',
  );

  const rootPrivateKey = await seed.createRootKey(entropy, salt);

  const accountPrivateKey = await addresses.createAccountPrivateKey(
    rootPrivateKey,
  );

  const paymentVerificationKey = await addresses.createPaymentVerificationKey(
    accountPrivateKey,
  );

  const stakeVerificationKey = await addresses.createStakeVerificationKey(
    accountPrivateKey,
  );

  const paymentAddress = await addresses.createPaymentAddress(
    paymentVerificationKey,
    stakeVerificationKey,
  );

  expect(paymentAddress).toBe(
    'addr_test1qq7a34tlx9mqt8uaztm6vw57szwwpy3dfhvwcvrfdrwf7gamqvjdwee2lylewwlcmq97eyx6jdy0wssuzmhcw5wv5vps0dsexs',
  );

  const stakeAddress = await addresses.createStakeAddress(stakeVerificationKey);

  expect(stakeAddress).toBe(
    'stake_test1uzasxfxhvu40j0uh80udszlvjrdfxj8hggwpdmu828x2xqcjwsfcv',
  );
});

it('derive public account key', async () => {
  const entropy = mnemonic.mnemonicToEntropy(process.env.MNEMONIC);

  const rootPrivateKey = await seed.createRootKey(entropy, '');

  const accountPrivateKey = await addresses.createAccountPrivateKey(
    rootPrivateKey,
  );

  const acctKey = await (await accountPrivateKey.to_public()).as_bytes();
  let words = bech32.toWords(
    Buffer.from(Buffer.from(acctKey).toString('hex'), 'hex'),
  );

  expect(bech32.encode('acct_xvk', words, Infinity)).toEqual(
    'acct_xvk1lszjv993vx5e4x4xanwsshsdts8czfprcatneh2ac6qzzkltjt8edcvft445ft3689hkdrghdnquqr402xx03jae9uzaezytjk726lgvfkcwz',
  );
});

it('derive payment addresses', async () => {
  const entropy = mnemonic.mnemonicToEntropy(process.env.MNEMONIC);

  const rootPrivateKey = await seed.createRootKey(entropy, '');

  const accountPrivateKey = await addresses.createAccountPrivateKey(
    rootPrivateKey,
  );

  const paymentAddresses = await addresses.deriveAddresses(
    accountPrivateKey,
    3,
  );

  expect(paymentAddresses).toEqual([
    {
      address:
        'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
      index: 0,
    },
    {
      address:
        'addr_test1qq7rfx95lfjvdvgdjz6udjd0aysdxl5yl94xnyw8z6qf5tht8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqdk3xcv',
      index: 1,
    },
    {
      address:
        'addr_test1qqkd3gxz20x9faq53nusw0779t473k94h8la48ezka89gp8t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqjak45p',
      index: 2,
    },
  ]);
});

it('discover addresses', async () => {
  const entropy = mnemonic.mnemonicToEntropy(process.env.MNEMONIC);

  const rootPrivateKey = await seed.createRootKey(entropy, '');

  const accountPrivateKey = await addresses.createAccountPrivateKey(
    rootPrivateKey,
  );

  const paymentAddresses = await addresses.deriveAddresses(
    accountPrivateKey,
    15,
  );

  const discoveredAddresses = await addresses.discoverAddresses(
    accountPrivateKey,
    20,
    addresses.AccountType.Receive,
    paymentAddresses.map(addr => addr.address),
  );

  expect(discoveredAddresses).toHaveLength(15);
});

it('discover signing key', async () => {
  const entropy = mnemonic.mnemonicToEntropy(process.env.MNEMONIC);

  const rootPrivateKey = await seed.createRootKey(entropy, '');

  const accountPrivateKey = await addresses.createAccountPrivateKey(
    rootPrivateKey,
  );

  const signingKeys = await addresses.discoverSigningAddresses(
    accountPrivateKey,
    [
      'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
      'addr_test1qptqxwfvcev04a3td7n9z5gynar5vdcjhertyws0hrxr6c0t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqh8jnvu',
      'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
    ],
  );

  const bech32SigningKeys = await Promise.all(
    signingKeys.map(k => k.to_bech32()),
  );

  const createKey = async (
    index: number,
    accountType: addresses.AccountType,
  ) => {
    const address = await addresses.createPaymentVerificationPrivateKey(
      accountPrivateKey,
      index,
      accountType,
    );

    return address.to_bech32();
  };

  const [privKey1, privKey2, privKey3] = await Promise.all([
    createKey(0, addresses.AccountType.Receive),
    createKey(0, addresses.AccountType.Internal),
    createKey(1, addresses.AccountType.Internal),
  ]);

  expect(bech32SigningKeys).toEqual([privKey1, privKey2, privKey3]);
});
