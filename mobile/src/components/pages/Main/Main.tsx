import React, { Fragment } from 'react';
import { View } from 'react-native';
import { StyleService, Text, useStyleSheet } from '@ui-kitten/components';

import { WalletsCarousel, Transactions, Footer } from './components';
import { spacing } from '../../spacing';

export const Main = (): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);

  return (
    <Fragment>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text category="h4">Wallets</Text>
        </View>

        <WalletsCarousel />

        <View style={styles.header}>
          <Text category="h4">Transactions</Text>
        </View>
        <Transactions />

        <Footer />
      </View>
    </Fragment>
  );
};

const themedStyle = StyleService.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
    padding: spacing[2],
  },
  header: {
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
  },
});
