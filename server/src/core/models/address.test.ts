/** @jest-environment setup-polly-jest/jest-environment-node */
import { autoSetupPolly, encryptRecord } from '../../polly';
import { Address } from './address';

describe('address', () => {
  const context = autoSetupPolly();

  beforeEach(() => encryptRecord(context));

  it('retrieves address utxos', async () => {
    const address = new Address(
      'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
    );

    const utxos = (await address.utxos()).map(utxo => utxo.serialize());

    expect(utxos).toEqual([
      {
        address:
          'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
        outputIndex: 1,
        txHash:
          '3e5f33d784f2ee6b58a4624df01f120f6816b2ba223c252250f4eec1a5152d1f',
        value: {
          assets: [
            {
              hex: '789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f16861707079636f696e',
              quantity: 1,
            },
          ],
          lovelace: 8829747,
        },
      },
      {
        address:
          'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
        outputIndex: 1,
        txHash:
          '931ea55a0cd1eb719cb65d5e64b3aa4499b37054b182a88b9d02bd4b39465648',
        value: {
          assets: [
            {
              hex: '789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f16861707079636f696e',
              quantity: 2,
            },
          ],
          lovelace: 84838426,
        },
      },
    ]);
  });
});
