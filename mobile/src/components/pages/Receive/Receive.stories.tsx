import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Receive } from './Receive';

export default {
  title: 'pages/Receive',
  component: Receive,
} as ComponentMeta<typeof Receive>;

export const Initial: ComponentStory<typeof Receive> = args => (
  <Receive {...args} />
);

Initial.args = {
  address:
    'addr_test1qqkd3gxz20x9faq53nusw0779t473k94h8la48ezka89gp8t8erv04n4weca43v4jhdrpqsc5f5mh2zx0pa4k04v34eqjak45p',
};
