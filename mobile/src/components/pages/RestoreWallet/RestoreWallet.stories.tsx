import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { RestoreWallet } from './RestoreWallet';

export default {
  title: 'pages/Restore Wallet',
  component: RestoreWallet,
  argTypes: {
    onRestorePress: { action: 'restore button pressed' },
  },
} as ComponentMeta<typeof RestoreWallet>;

export const Initial: ComponentStory<typeof RestoreWallet> = args => (
  <RestoreWallet {...args} />
);
