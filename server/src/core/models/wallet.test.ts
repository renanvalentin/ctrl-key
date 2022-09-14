import { Wallet } from './wallet';

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

  expect(txs).toEqual([
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
      hash: '6d8ab0f38c5748e6fd59e04ec162c098784b27cbaaca6d2d1ab702e01f29a97c',
      blockTime: 1662685090,
      fees: 182221,
    },
  ]);

  // const utxo = await Promise.all(txs.map(tx => tx.utxo()));

  // console.log(JSON.stringify(utxo, null, 2));
}, 30_000_000);
