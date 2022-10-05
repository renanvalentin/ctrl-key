import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { NanoX } from './NanoX';

export default {
  title: 'pages/Nano X',
  component: NanoX,
  argTypes: {
    onCreatePress: { action: 'restore button pressed' },
  },
} as ComponentMeta<typeof NanoX>;

export const Initial: ComponentStory<typeof NanoX> = args => (
  <NanoX {...args} />
);

export const Connecting: ComponentStory<typeof NanoX> = args => (
  <NanoX {...args} />
);

Connecting.args = {
  connecting: true,
};
