import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Amount } from './Amount';

export default {
  title: 'pages/Send/Amount',
  component: Amount,
  argTypes: {
    onReviewPress: { action: 'review button pressed' },
  },
} as ComponentMeta<typeof Amount>;

export const Initial: ComponentStory<typeof Amount> = args => (
  <Amount {...args} />
);

Initial.args = {
  calculatingFees: false,
};

export const CalculatingFees: ComponentStory<typeof Amount> = args => (
  <Amount {...args} />
);

CalculatingFees.args = {
  calculatingFees: true,
};
