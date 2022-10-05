import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, useStyleSheet, Button } from '@ui-kitten/components';
import { useStateContext } from '../context';
import { spacing } from '../../../spacing';
import { useActions } from '../actions';

const renderReceiveIcon = (props: any) => (
  <Icon {...props} name="diagonal-arrow-right-down-outline" col />
);

const renderWithdrawalIcon = (props: any) => (
  <Icon {...props} name="diagonal-arrow-right-up-outline" col />
);

export const Footer = () => {
  const styles = useStyleSheet(themedStyle);
  const actions = useActions();

  return (
    <View style={styles.buttons}>
      <Button
        status="success"
        style={styles.button}
        accessoryLeft={renderReceiveIcon}
        onPress={() => actions.onReceivePress$.next()}>
        Receive
      </Button>
      <Button
        style={[styles.button, styles.gap]}
        accessoryLeft={renderWithdrawalIcon}
        onPress={() => actions.onSendPress$.next()}>
        Send
      </Button>
    </View>
  );
};

const themedStyle = StyleSheet.create({
  buttons: {
    marginTop: spacing[2],
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
  },
  gap: {
    marginLeft: spacing[2],
  },
});
