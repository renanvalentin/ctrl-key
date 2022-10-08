/** @jest-environment setup-polly-jest/jest-environment-node */
import { createServer } from '@graphql-yoga/node';
import request from 'supertest';
import EventSource from 'eventsource';
import { autoSetupPolly, encryptRecord } from '../polly';
import { schema } from '../schema';
import { CSL } from '../core';
import { PendingTxs, Tx } from '../pending-txs';
import { context } from '../context';
import { firstValueFrom, ReplaySubject } from 'rxjs';

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

const submitTx = `
{
  submitTx(
    tx: "84a40081825820e7e9e5d74f2c5a00828cd1f638ec0991ea198d30a55c6fccb81f8ea32b425f040101828258390092613032ecc6c1c2cf451e752b0a222dd8a70370db79bdf4721cc70826a4f8878feff4878c22176dc43a93ba8af53c9b75124dadcf419cfa1a001e8480825839005f697c1763c12a954abef22ae9f31c81940918042888bafdd69310bceb3e46c7d6757671dac59595da308218a269bba846787b5b3eac8d72821a05629e81a1581c789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f1a1496861707079636f696e02021a0002990d031a04229435a10081825820bf6376ac22e13ac206b33cb768f86d2b53a21a001825f780a299b5b41173ad6f58404852585ca64dcfa8d536a75c4d1b3b53964247c1f00be58bc6cb6aad9ed921358cbbe3d2d9ba19fe8653256234117c0750c8cf03fdf5478d1a6e7f434b8a0d02f5f6"
  ) {
    hash
  }
}
`;

const pendingTxSubscription = `
  subscription {
    pendingTxs(
      txHash: "d1662b24fa9fe985fc2dce47455df399cb2e31e1e1819339e885801cc3578908"
    ) {
      hash
    }
  }
`;

describe('transaction queries', function () {
  let pollyContext = autoSetupPolly();

  beforeEach(() => encryptRecord(pollyContext));

  it('responds with json', async function () {
    const yoga = createServer({ schema });

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
  });

  it('submit txs', async function () {
    const pendingTxs$ = new ReplaySubject<Tx>();
    const pendingTxs = new PendingTxs(pendingTxs$);
    const txHash =
      'd1662b24fa9fe985fc2dce47455df399cb2e31e1e1819339e885801cc3578908';

    pollyContext.polly.server
      .post('https://cardano-testnet.blockfrost.io/api/v0/tx/submit')
      .intercept((_, res) => {
        res.status(200).json(txHash);
      });

    const yoga = await createServer({
      schema,
      context: context(pendingTxs),
    });

    const response = await request(yoga).post('/graphql').send({
      query: submitTx,
    });

    expect(response.status).toEqual(200);
    expect(response.body.data.submitTx).toEqual({ hash: txHash });

    const tx = await firstValueFrom(pendingTxs$);

    expect(tx).toEqual(txHash);
  });
});
