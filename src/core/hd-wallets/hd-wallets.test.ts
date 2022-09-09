import * as addresses from './addresses';
import * as mnemonic from './mnemonic';
import * as seed from './seed';

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
