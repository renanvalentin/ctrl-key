import { Spinner, StyleService } from '@ui-kitten/components';
import React from 'react';
import { View } from 'react-native';

export const LoadingIndicator = () => (
  <View style={styles.indicator}>
    <Spinner size="small" />
  </View>
);

const styles = StyleService.create({
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
