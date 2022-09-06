import { Wallet } from './models';

jest.mock('./cardano-serialization-lib', () => ({
  __esModule: true,
  ...require('./__tests__/cardano-serialization-lib'),
}));

it('serialize wallet', async () => {
  const salt = 'password';

  const seedWords =
    'across angle sock very garbage link wine rally six hungry goat orphan tonight tube aim someone prosper fine glance phrase various stuff educate melody';

  const name = 'w';

  const wallet = await Wallet.create({
    name,
    seedWords,
    salt,
  });

  const serializedWallet = await wallet.serialize();

  const deserializedWallet = await Wallet.deserialize(serializedWallet);

  expect(wallet.paymentAddresses).toEqual(deserializedWallet.paymentAddresses);
});
