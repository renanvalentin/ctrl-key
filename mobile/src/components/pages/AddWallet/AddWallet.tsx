import React, { Fragment } from 'react';
import { View } from 'react-native';
import {
  Button,
  Icon,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import { spacing } from '../../spacing';

interface Props {
  onRestoreWalletPress: () => void;
  onLedgerNanoXPress: () => void;
}

const ImportIcon = (props: any) => (
  <Icon {...props} name="cloud-upload-outline" />
);

const NanoXIcon = (props: any) => <Icon {...props} name="hard-drive-outline" />;

export const AddWallet = ({
  onLedgerNanoXPress,
  onRestoreWalletPress,
}: Props): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);

  return (
    <Fragment>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text category="h4">Add Wallet</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.block}>
            <Button accessoryLeft={ImportIcon} onPress={onRestoreWalletPress}>
              Restore Wallet
            </Button>
          </View>
          <View style={styles.block}>
            <Button accessoryLeft={NanoXIcon} onPress={onLedgerNanoXPress}>
              Ledger Nano X
            </Button>
          </View>
        </View>
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
  content: {
    paddingTop: spacing[5],
    alignItems: 'center',
  },
  header: {
    paddingBottom: spacing[2],
  },
  block: {
    marginVertical: spacing[2],
  },
});
