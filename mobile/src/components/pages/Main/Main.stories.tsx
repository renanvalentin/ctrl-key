import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useSubscription } from 'observable-hooks';

import { Main } from './Main';
import { Tx, Wallet } from './data';
import { txs, wallets } from './fixtures';
import { Provider as StateProvider } from './context';
import { Provider as ActionProvider, useActions } from './actions';

export default {
  title: 'pages/Main',
  component: Main,
  argTypes: {
    onAddWalletPress: { action: 'add wallet pressed' },
    onReceivePress: { action: 'receive pressed' },
    onSendPress: { action: 'send pressed' },
    onWalletChange: { action: 'wallet changed' },
  },
} as ComponentMeta<typeof Main>;

interface Props {
  onAddWalletPress: () => void;
  onReceivePress: () => void;
  onSendPress: () => void;
  onWalletChange: () => void;
  wallets: Wallet[];
  txs: Tx[];
  loadingTxs: boolean;
}

const Story = ({ txs, wallets, loadingTxs, ...props }: Props) => {
  return (
    <ActionProvider>
      <StateProvider initialValue={{ txs, wallets, loadingTxs }}>
        <Renderer
          {...props}
          txs={txs}
          wallets={wallets}
          loadingTxs={loadingTxs}
        />
      </StateProvider>
    </ActionProvider>
  );
};

const Renderer = (args: Props) => {
  const actions = useActions();

  useSubscription(actions.addWallet$, args.onAddWalletPress);
  useSubscription(actions.changeWallet$, args.onWalletChange);
  useSubscription(actions.onReceivePress$, args.onReceivePress);
  useSubscription(actions.onSendPress$, args.onSendPress);

  return <Main />;
};

export const WithTxs: ComponentStory<typeof Story> = args => (
  <Story {...args} />
);

WithTxs.args = {
  wallets: wallets,
  txs: txs,
};

export const Empty: ComponentStory<typeof Story> = args => <Story {...args} />;

Empty.args = {
  wallets: [] as Wallet[],
  txs: [] as Tx[],
};

export const WithWallets: ComponentStory<typeof Story> = args => (
  <Story {...args} />
);

WithWallets.args = {
  wallets: wallets,
  txs: [] as Tx[],
};

export const Loading: ComponentStory<typeof Story> = args => (
  <Story {...args} />
);

Loading.args = {
  wallets: wallets,
  txs: [] as Tx[],
  loadingTxs: true,
};
