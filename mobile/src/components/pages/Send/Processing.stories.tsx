import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Processing } from './Processing';

export default {
  title: 'pages/Send/Processing',
  component: Processing,
  argTypes: {
    onTransactionLinkPress: { action: 'transaction link button pressed' },
    onClosePress: { action: 'close button pressed' },
  },
} as ComponentMeta<typeof Processing>;

export const Initial: ComponentStory<typeof Processing> = args => (
  <Processing {...args} />
);

export const Completed: ComponentStory<typeof Processing> = args => (
  <Processing {...args} />
);

Completed.args = {
  completed: true,
};
