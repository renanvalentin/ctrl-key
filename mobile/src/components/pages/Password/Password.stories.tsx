import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Password } from './Password';

export default {
  title: 'pages/Password',
  component: Password,
  argTypes: {
    onPinEnter: { action: 'pin entered' },
  },
} as ComponentMeta<typeof Password>;

export const Initial: ComponentStory<typeof Password> = args => (
  <Password {...args} />
);

Initial.args = {
  pin: '1123',
};
