import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Summary } from './Summary';

export default {
  title: 'pages/Send/Summary',
  component: Summary,
  argTypes: {
    onConfirmPress: { action: 'confirm button pressed' },
  },
} as ComponentMeta<typeof Summary>;

export const Initial: ComponentStory<typeof Summary> = args => (
  <Summary {...args} />
);

Initial.args = {
  lovelace: '5 ADA',
  fees: '5 ADA',
  address:
    'addr_test1qqkd3gxz20x9faq53nusw0779t473k94h8la48ezka89gp8t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqjak45p',
};
