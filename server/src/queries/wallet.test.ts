/** @jest-environment setup-polly-jest/jest-environment-node */
import { createServer } from '@graphql-yoga/node';
import request from 'supertest';
import { autoSetupPolly } from '../polly';
import { schema } from '../schema';

const yoga = createServer({ schema });

const query = `
{  
  wallet(stakeAddress:"stake_test1ur4nu3k86e6hvuw6ck2etk3ssgv2y6dm4pr8s76m86kg6usappr74") {
    balance,
    marketPrice,
    txs {
      type,
      amount,
      fees,
      date,
      id
    }
  }
}
`;

describe('query wallet', function () {
  let pollyContext = autoSetupPolly();

  it('responds with json', async function () {
    const response = await request(yoga).post('/graphql').send({
      query,
    });

    expect(response.status).toEqual(200);

    expect(response.body.data).toEqual({
      wallet: {
        balance: '90349185',
        marketPrice: 0.461053,
        txs: [
          {
            type: 'Outgoing',
            amount: '-2170253',
            fees: '170253',
            date: 1663722691,
            id: 'de9280ec0b2ef7fa2dd69f7623600a8f4df27595879cacb642bc854df74eedc4',
          },
          {
            type: 'Outgoing',
            amount: '-8171837',
            fees: '171837',
            date: 1663720589,
            id: 'e7e9e5d74f2c5a00828cd1f638ec0991ea198d30a55c6fccb81f8ea32b425f04',
          },
          {
            type: 'Outgoing',
            amount: '-2170253',
            fees: '170253',
            date: 1663720573,
            id: 'b729c01c4b8ecb5bbbb3d6505fa3d43ed7be00f69a1a9d2dbb1f38551403477d',
          },
          {
            type: 'Outgoing',
            amount: '-2168317',
            fees: '168317',
            date: 1663705384,
            id: 'f1176f6bc7d062b3a64e3b2d2998d93e31a4f716b250719b914971dbe52793c3',
          },
          {
            type: 'Outgoing',
            amount: '-2170253',
            fees: '170253',
            date: 1663705283,
            id: 'd5d855d5ef150284659b4bbd7a3b71614ce6cf93a936aed4e5323e0252d2c55a',
          },
          {
            type: 'Outgoing',
            amount: '-2168317',
            fees: '168317',
            date: 1663701859,
            id: 'fdba856e2688cb36e1a382c2c5e1a70bd37e792bc5505e03157448435261a671',
          },
          {
            type: 'Outgoing',
            amount: '-2170253',
            fees: '170253',
            date: 1663701828,
            id: 'abe6bde0016f8a6fa7e0bc31cb238f3cbb834b429679cf6073373063e9940021',
          },
          {
            type: 'Incoming',
            amount: '100000000',
            fees: null,
            date: 1663351058,
            id: '2ac7d239675972200bc664576fee67e23eacb70ff5943f985b9f64d1ae82e196',
          },
          {
            type: 'Outgoing',
            amount: '-2182221',
            fees: '182221',
            date: 1662685090,
            id: '6d8ab0f38c5748e6fd59e04ec162c098784b27cbaaca6d2d1ab702e01f29a97c',
          },
          {
            type: 'Incoming',
            amount: '10000000',
            fees: null,
            date: 1662685007,
            id: '378eac004bdec2421456d507b8549eedd69955182e29d469c3b2833f6473d5ce',
          },
          {
            type: 'Outgoing',
            amount: '-1279111',
            fees: '171441',
            date: 1662602880,
            id: '03bb413faf369b8990b95eb5c0f1ca08c0f8199ea32b31ea7501f70f3c60ba89',
          },
          {
            type: 'Incoming',
            amount: '5000000',
            fees: null,
            date: 1662601557,
            id: '7b94e19a39d437ea8ae8a836309b1c39f9b549f0cd02eefd271ee83975ac5893',
          },
          {
            type: 'Outgoing',
            amount: '-2000000',
            fees: '892330',
            date: 1662601462,
            id: '86b6173a53568e464bafce315ec6f61de0d5c180e144d9c2c57b86bb012fc0d2',
          },
          {
            type: 'Incoming',
            amount: '2000000',
            fees: null,
            date: 1662514094,
            id: '87eb5358c1480739beed120e99e43ffc7e2c4a518bfb0a07c268a47e1db08b5b',
          },
        ],
      },
    });

    await pollyContext.polly.stop();
  });
});
