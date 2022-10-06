import { TxValue } from './tx-value';

it('toValue', () => {
  const policy1 = '6b8d07d69639e9413dd637a1a815a7323c69c86abbafb66dbfdb1aa7';
  const assetName1 = '';

  const policy2 = '789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f1';
  const assetName2 = '6861707079636f696e';

  const txValue = new TxValue({
    lovelace: 983815157n,
    assets: [
      {
        hex: policy1 + assetName1,
        quantity: 3n,
      },
      {
        hex: policy2 + assetName2,
        quantity: 6n,
      },
    ],
  });

  expect(txValue.toValue().to_js_value()).toEqual({
    coin: '983815157',
    multiasset: new Map([
      [
        '6b8d07d69639e9413dd637a1a815a7323c69c86abbafb66dbfdb1aa7',
        new Map([['', '3']]),
      ],
      [
        '789ef8ae89617f34c07f7f6a12e4d65146f958c0bc15a97b4ff169f1',
        new Map([['6861707079636f696e', '6']]),
      ],
    ]),
  });
});
