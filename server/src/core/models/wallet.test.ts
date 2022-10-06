/** @jest-environment setup-polly-jest/jest-environment-node */
import { autoSetupPolly, encryptRecord } from '../../polly';
import { Tx } from './tx';
import { Wallet } from './wallet';

describe('wallet', () => {
  const pollyContext = autoSetupPolly();

  beforeEach(() => encryptRecord(pollyContext));

  it('retrieve wallet data', async () => {
    const wallet = new Wallet({
      stakeAddress:
        'stake_test1ur4nu3k86e6hvuw6ck2etk3ssgv2y6dm4pr8s76m86kg6usappr74',
    });

    const account = await wallet.account();

    const addresses = await account.addresses();

    expect(addresses).toEqual([
      {
        address:
          'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
      },
      {
        address:
          'addr_test1qptqxwfvcev04a3td7n9z5gynar5vdcjhertyws0hrxr6c0t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqh8jnvu',
      },
      {
        address:
          'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
      },
    ]);

    const txs = await (
      await Promise.all(addresses.map(addr => addr.transactions()))
    ).flatMap(tx => tx);

    expect(txs.length).toBeGreaterThan(0);

    expect(txs).toEqual(
      [
        {
          hash: '931ea55a0cd1eb719cb65d5e64b3aa4499b37054b182a88b9d02bd4b39465648',
          blockTime: 1664933410,
          fees: 170253,
        },
        {
          hash: '3e5f33d784f2ee6b58a4624df01f120f6816b2ba223c252250f4eec1a5152d1f',
          blockTime: 1664739745,
          fees: 170253,
        },
        {
          hash: '869d9b329f55f4757be0e51c83c7c3319ebb7c57f13011e5729d2bdccc23b2b7',
          blockTime: 1664738883,
          fees: 170253,
        },
        {
          hash: 'cfdf7f8e998e66f425e7e1502e644ad1208d3da27132f68b59511e2b9db9ff70',
          blockTime: 1663806553,
          fees: 170253,
        },
        {
          hash: 'de9280ec0b2ef7fa2dd69f7623600a8f4df27595879cacb642bc854df74eedc4',
          blockTime: 1663722691,
          fees: 170253,
        },
        {
          hash: 'e7e9e5d74f2c5a00828cd1f638ec0991ea198d30a55c6fccb81f8ea32b425f04',
          blockTime: 1663720589,
          fees: 171837,
        },
        {
          hash: 'b729c01c4b8ecb5bbbb3d6505fa3d43ed7be00f69a1a9d2dbb1f38551403477d',
          blockTime: 1663720573,
          fees: 170253,
        },
        {
          hash: 'f1176f6bc7d062b3a64e3b2d2998d93e31a4f716b250719b914971dbe52793c3',
          blockTime: 1663705384,
          fees: 168317,
        },
        {
          hash: 'd5d855d5ef150284659b4bbd7a3b71614ce6cf93a936aed4e5323e0252d2c55a',
          blockTime: 1663705283,
          fees: 170253,
        },
        {
          hash: 'fdba856e2688cb36e1a382c2c5e1a70bd37e792bc5505e03157448435261a671',
          blockTime: 1663701859,
          fees: 168317,
        },
        {
          hash: 'abe6bde0016f8a6fa7e0bc31cb238f3cbb834b429679cf6073373063e9940021',
          blockTime: 1663701828,
          fees: 170253,
        },
        {
          hash: '2ac7d239675972200bc664576fee67e23eacb70ff5943f985b9f64d1ae82e196',
          blockTime: 1663351058,
          fees: 196125,
        },
        {
          hash: '6d8ab0f38c5748e6fd59e04ec162c098784b27cbaaca6d2d1ab702e01f29a97c',
          blockTime: 1662685090,
          fees: 182221,
        },
        {
          hash: '378eac004bdec2421456d507b8549eedd69955182e29d469c3b2833f6473d5ce',
          blockTime: 1662685007,
          fees: 179801,
        },
        {
          hash: '03bb413faf369b8990b95eb5c0f1ca08c0f8199ea32b31ea7501f70f3c60ba89',
          blockTime: 1662602880,
          fees: 171441,
        },
        {
          hash: '7b94e19a39d437ea8ae8a836309b1c39f9b549f0cd02eefd271ee83975ac5893',
          blockTime: 1662601557,
          fees: 179757,
        },
        {
          hash: '86b6173a53568e464bafce315ec6f61de0d5c180e144d9c2c57b86bb012fc0d2',
          blockTime: 1662601462,
          fees: 892330,
        },
        {
          hash: '87eb5358c1480739beed120e99e43ffc7e2c4a518bfb0a07c268a47e1db08b5b',
          blockTime: 1662514094,
          fees: 177513,
        },
        {
          hash: '6d8ab0f38c5748e6fd59e04ec162c098784b27cbaaca6d2d1ab702e01f29a97c',
          blockTime: 1662685090,
          fees: 182221,
        },
        {
          hash: '03bb413faf369b8990b95eb5c0f1ca08c0f8199ea32b31ea7501f70f3c60ba89',
          blockTime: 1662602880,
          fees: 171441,
        },
        {
          hash: '3e5f33d784f2ee6b58a4624df01f120f6816b2ba223c252250f4eec1a5152d1f',
          blockTime: 1664739745,
          fees: 170253,
        },
        {
          hash: '5cc577d7b441558a547bafbc8bd04e99f132b1205ef40175eddb930a040e3e93',
          blockTime: 1663894204,
          fees: 179801,
        },
        {
          hash: 'abe6bde0016f8a6fa7e0bc31cb238f3cbb834b429679cf6073373063e9940021',
          blockTime: 1663701828,
          fees: 170253,
        },
        {
          hash: '6d8ab0f38c5748e6fd59e04ec162c098784b27cbaaca6d2d1ab702e01f29a97c',
          blockTime: 1662685090,
          fees: 182221,
        },
      ].map(tx => new Tx({ ...tx })),
    );

    await pollyContext.polly.stop();

    // const utxo = await Promise.all(txs.map(tx => tx.utxo()));

    // console.log(JSON.stringify(utxo, null, 2));
  }, 30_000_000);
});
