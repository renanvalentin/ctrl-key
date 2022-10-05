/** @jest-environment setup-polly-jest/jest-environment-node */
import { createServer } from '@graphql-yoga/node';
import request from 'supertest';
import { autoSetupPolly } from '../polly';
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
          transaction_id:
            'cfdf7f8e998e66f425e7e1502e644ad1208d3da27132f68b59511e2b9db9ff70',
          index: 1,
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
            coin: '85008679',
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
      ttl: expect.any(String),
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
    });

    await pollyContext.polly.stop();
  });
});
