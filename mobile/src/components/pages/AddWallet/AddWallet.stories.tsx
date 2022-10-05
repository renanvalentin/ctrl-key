import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AddWallet } from './AddWallet';

export default {
  title: 'pages/Add Wallet',
  component: AddWallet,
  argTypes: {
    onRestoreWalletPress: { action: 'restore button pressed' },
    onLedgerNanoXPress: { action: 'ledger button pressed' },
  },
} as ComponentMeta<typeof AddWallet>;

export const Initial: ComponentStory<typeof AddWallet> = args => (
  <AddWallet {...args} />
);
