import React from 'react';
import { StyleService, Text, useStyleSheet, Card } from '@ui-kitten/components';
import { spacing } from '../../../spacing';
import { useActions } from '../actions';

export const AddWallet = (): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);
  const actions = useActions();

  return (
    <Card style={styles.container} onPress={() => actions.addWallet$.next()}>
      <Text category="h1">Add wallet</Text>
    </Card>
  );
};

const themedStyle = StyleService.create({
  container: {
    width: spacing[30],
    height: spacing[15],
    borderRadius: 4,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
});
