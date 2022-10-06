/** @jest-environment setup-polly-jest/jest-environment-node */
import { createServer } from '@graphql-yoga/node';
import request from 'supertest';
import { autoSetupPolly, encryptRecord } from '../polly';
import { schema } from '../schema';
import { CSL } from '../core';

const yoga = createServer({ schema });

const query = `
{
  buildTx(
    stakeAddress: "stake_test1ur4nu3k86e6hvuw6ck2etk3ssgv2y6dm4pr8s76m86kg6usappr74"
    paymentAddress: "addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z"
    value: {lovelace: "3000000", assets: []}
  ) {
    hex
    witnessesAddress
    summary {
      fees
      paymentAddresses {
        address
        amount {
          lovelace
        }
      }
    } 
  }
}
`;

describe('transaction queries', function () {
  let pollyContext = autoSetupPolly();

  beforeEach(() => encryptRecord(pollyContext));

  it('responds with json', async function () {
    const response = await request(yoga).post('/graphql').send({
      query,
    });

    const existingAddresses = new Set([
      'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
      'addr_test1qptqxwfvcev04a3td7n9z5gynar5vdcjhertyws0hrxr6c0t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqh8jnvu',
      'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
    ]);

    expect(response.status).toEqual(200);

    const { witnessesAddress, hex, summary } = response.body.data.buildTx;

    expect(
      witnessesAddress.every((addr: string) => existingAddresses.has(addr)),
    ).toBeTruthy();

    expect(summary).toEqual({
      fees: '170253',
      paymentAddresses: [
        {
          address:
            'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
          amount: {
            lovelace: '3000000',
          },
        },
      ],
    });

    expect(CSL.TransactionBody.from_hex(hex).to_js_value()).toEqual({
      inputs: [
        {
          transaction_id: expect.toBeOneOf([
            '3e5f33d784f2ee6b58a4624df01f120f6816b2ba223c252250f4eec1a5152d1f',
          ]),
          index: expect.toBeOneOf([0, 1]),
        },
      ],
      outputs: [
        {
          address:
            'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
          amount: {
            coin: '3000000',
            multiasset: undefined,
          },
          plutus_data: undefined,
          script_ref: undefined,
        },
        {
          address:
            'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
          amount: {
            coin: expect.toBeOneOf(['5659494']),
            multiasset: new Map([
              [
                '789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f1',
                new Map([['6861707079636f696e', expect.toBeOneOf(['2', '1'])]]),
              ],
            ]),
          },
          plutus_data: undefined,
          script_ref: undefined,
        },
      ],
      fee: '170253',
      ttl: expect.any(String),
      certs: undefined,
      withdrawals: undefined,
      update: undefined,
      auxiliary_data_hash: undefined,
      validity_start_interval: undefined,
      mint: undefined,
      script_data_hash: undefined,
      collateral: undefined,
      required_signers: undefined,
      network_id: undefined,
      collateral_return: undefined,
      total_collateral: undefined,
      reference_inputs: undefined,
    });

    await pollyContext.polly.stop();
  });
});
