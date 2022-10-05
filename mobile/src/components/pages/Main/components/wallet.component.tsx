import React from 'react';
import { StyleService, Text, useStyleSheet, Card } from '@ui-kitten/components';
import { spacing } from '../../../spacing';
import * as Data from '../data';
import { View } from 'react-native';

interface Props {
  wallet: Data.Wallet;
}

export const Wallet = ({ wallet }: Props): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);

  return (
    <Card style={styles.postItem}>
      <Text category="s1">{wallet.name}</Text>
      <View style={styles.marketPrice}>
        <Text category="h2">{wallet.marketPrice}</Text>
        <Text category="c1" style={styles.currency}>
          {' '}
          {wallet.currency}
        </Text>
      </View>
      <Text category="s2">{wallet.balance}</Text>
    </Card>
  );
};

const themedStyle = StyleService.create({
  postItem: {
    width: spacing[30],
    height: spacing[15],
    borderRadius: 4,
    marginHorizontal: 8,
    // overflow: 'hidden',
  },
  marketPrice: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currency: {
    marginBottom: 5,
  },
});
