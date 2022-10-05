import React, { Fragment } from 'react';
import { View } from 'react-native';
import {
  Button,
  Layout,
  Spinner,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import { spacing } from '../../spacing';

interface Props {
  completed: boolean;
  onTransactionLinkPress: () => void;
  onClosePress: () => void;
}

export const Processing = ({
  completed,
  onTransactionLinkPress,
  onClosePress,
}: Props): React.ReactElement => {
  const styles = useStyleSheet(themedStyles);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text category="h4">{completed ? 'Completed' : 'Processing'}</Text>
      </View>
      <Layout style={styles.content} level="1">
        {!completed && <Spinner size="giant" />}
        {completed && (
          <Fragment>
            <Button status="primary" onPress={() => onTransactionLinkPress()}>
              See transaction details
            </Button>
            <Button
              status="success"
              onPress={() => onClosePress()}
              style={styles.closeButton}>
              Close
            </Button>
          </Fragment>
        )}
      </Layout>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    marginVertical: spacing[2],
  },
});
