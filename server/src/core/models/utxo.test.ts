import { Address } from './address';
import { TxDirections, Utxo } from './utxo';
import * as fixtures from './utxo.fixture';

it('detect incoming tx', async () => {
  const utxo = new Utxo(fixtures.received);

  const address = new Address(
    'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
  );

  const txType = utxo.direction([address]);

  expect(txType).toEqual(TxDirections.Incoming);
});

it('detect outcoming tx', async () => {
  const utxo = new Utxo(fixtures.withdrawal);

  const address = new Address(
    'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
  );

  const txType = utxo.direction([address]);

  expect(txType).toEqual(TxDirections.Outgoing);
});

it('calculate received amount', async () => {
  const utxo = new Utxo(fixtures.received);

  const address = new Address(
    'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
  );

  const txType = utxo.txValue([address]);

  expect(txType).toEqual({ lovelace: 2_000_000n, assets: [] });
});

it('calculate withdrawal amount', async () => {
  const utxo = new Utxo(fixtures.withdrawal);

  const address = new Address(
    'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
  );

  const txType = utxo.txValue([address]);

  expect(txType).toEqual({ lovelace: -2_000_000n, assets: [] });
});

it('calculate assets', async () => {
  const utxo = new Utxo(fixtures.withAssets);

  const address = new Address(
    'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
  );

  const txType = utxo.txValue([address]);

  expect(txType).toEqual({
    lovelace: 5_000_000n,
    assets: [
      {
        hex: '94d4cdbcffb09ebd4780d94f932a657dc4852530fa8013df66c72d4c676f6f64636f696e',
        quantity: 1n,
      },
    ],
  });
});

it('multiple addresses', async () => {
  const utxo = new Utxo(fixtures.multipleAssets);

  const address = new Address(
    'addr_test1qp0kjlqhv0qj4922hmez460nrjqegzgcqs5g3wha66f3p08t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqy4ns2d',
  );

  const address2 = new Address(
    'addr_test1qptqxwfvcev04a3td7n9z5gynar5vdcjhertyws0hrxr6c0t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqh8jnvu',
  );

  const address3 = new Address(
    'addr_test1qra2njhhucffhtfwq3zyvz3h9huqd87d83zay44h2a6nj0lt8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eq32w05z',
  );

  const txType = utxo.txValue([address, address2, address3]);

  expect(txType).toEqual({
    lovelace: -2_182_221n,
    assets: [
      {
        hex: '94d4cdbcffb09ebd4780d94f932a657dc4852530fa8013df66c72d4c676f6f64636f696e',
        quantity: -1n,
      },
      {
        hex: '789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f16861707079636f696e',
        quantity: -2n,
      },
    ],
  });
});
