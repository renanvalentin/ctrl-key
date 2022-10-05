import React from 'react';
import { View } from 'react-native';
import { StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { spacing } from '../../spacing';
import { PinCode } from '../../ui';

interface Props {
  pin?: string;
  onPinEnter: (value: string) => void;
  incorrect?: boolean;
}

export const Password = ({
  pin,
  onPinEnter,
  incorrect,
}: Props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text category="h4">Password</Text>
      </View>
      <View style={styles.formContainer}>
        <PinCode onFulfill={onPinEnter} pin={pin} incorrect={incorrect} />
      </View>
    </View>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
    padding: spacing[2],
  },
  header: {
    paddingBottom: spacing[2],
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
