import React, { Fragment } from 'react';
import { View } from 'react-native';
import {
  Button,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';

import { spacing } from '../../spacing';

interface Props {
  address: string;
  lovelace: string;
  fees: string;
  onConfirmPress: () => void;
}

export const Summary = ({
  address,
  lovelace,
  fees,
  onConfirmPress,
}: Props): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);

  return (
    <Fragment>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text category="h4">Review</Text>
        </View>

        <Layout style={styles.formContainer} level="1">
          <View>
            <Text category="s1">Address:</Text>
            <Text category="s2">{address}</Text>
          </View>
          <View style={styles.block}>
            <Text category="s1">Amount:</Text>
            <Text category="s2">{lovelace}</Text>
          </View>
          <View style={styles.block}>
            <Text category="s1">Fees:</Text>
            <Text category="s2">{fees}</Text>
          </View>
        </Layout>
        <Button
          style={styles.reviewButton}
          size="giant"
          onPress={() => onConfirmPress()}>
          Confirm
        </Button>
      </View>
    </Fragment>
  );
};

const themedStyle = StyleService.create({
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
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
  },
  block: {
    marginTop: spacing[3],
  },
  reviewButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
});
