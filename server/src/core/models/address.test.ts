import { Address } from './address';

it('retrieves address utxos', async () => {
  const address = new Address(
    'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
  );

  const utxos = await address.utxos();

  expect(utxos).toEqual([
    {
      txHash:
        '6d8ab0f38c5748e6fd59e04ec162c098784b27cbaaca6d2d1ab702e01f29a97c',
      outputIndex: 1,
      address:
        'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
      value: {
        lovelace: 11538668n,
        assets: [
          {
            hex: '789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f16861707079636f696e',
            quantity: 2n,
          },
        ],
      },
    },
  ]);
});
