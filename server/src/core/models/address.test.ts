/** @jest-environment setup-polly-jest/jest-environment-node */
import { autoSetupPolly } from '../../polly';
import { Address } from './address';

describe('address', () => {
  autoSetupPolly();

  it('retrieves address utxos', async () => {
    const address = new Address(
      'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
    );

    const utxos = (await address.utxos()).map(utxo => utxo.serialize());

    expect(utxos).toEqual([
      {
        txHash:
          '5cc577d7b441558a547bafbc8bd04e99f132b1205ef40175eddb930a040e3e93',
        outputIndex: 0,
        address:
          'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
        value: {
          lovelace: 10000000,
          assets: [
            {
              hex: '789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f16861707079636f696e',
              quantity: 1,
            },
          ],
        },
      },
    ]);
  });
});
