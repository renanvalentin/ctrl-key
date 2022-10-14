import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Divider,
  List,
  ListItem,
  useStyleSheet,
  Layout,
  Text,
  Spinner,
} from '@ui-kitten/components';
import * as Data from '../data';
import { useStateContext } from '../context';
import { spacing } from '../../../spacing';
import { Icon } from '../../../ui';

export const Transactions = () => {
  const styles = useStyleSheet(themedStyle);
  const [state] = useStateContext();

  if (state.loadingTxs) {
    return (
      <Layout level="1" style={styles.loading}>
        <Spinner />
      </Layout>
    );
  }

  if (state.txs.length === 0) {
    return (
      <Layout level="1" style={styles.empty}>
        <Text>You don't have any transactions yet</Text>
      </Layout>
    );
  }

  const renderItem = ({ item }: { item: Data.Tx }) => {
    const renderIcon = () => {
      if (item.type === 'received') return renderReceiveIcon;
      if (item.type === 'withdrawal') return renderWithdrawalIcon;
      return renderPendingIcon;
    };

    return (
      <ListItem
        key={item.id}
        title={item.amount}
        description={item.fees ? `Fees: ${item.fees}` : undefined}
        accessoryLeft={renderIcon()}
      />
    );
  };

  const renderReceiveIcon = (props: any) => (
    <Icon
      {...props}
      name="diagonal-arrow-right-down-outline"
      col
      fill="#4FDD39"
    />
  );

  const renderWithdrawalIcon = (props: any) => (
    <Icon
      {...props}
      name="diagonal-arrow-right-up-outline"
      col
      fill="#FF4A3D"
    />
  );

  const renderPendingIcon = (props: any) => (
    <Icon {...props} name="clock-outline" col fill="#FFA73D" />
  );

  return (
    <List
      style={styles.container}
      data={state.txs}
      ItemSeparatorComponent={Divider}
      renderItem={renderItem}
    />
  );
};

const themedStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    padding: spacing[2],
  },
  loading: {
    // padding: spacing[2],
    height: spacing[5],
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
