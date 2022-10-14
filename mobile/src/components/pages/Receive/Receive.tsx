import React, { Fragment, useState } from 'react';
import { View } from 'react-native';
import {
  Button,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';
import { Icon } from '../../ui';

import { spacing } from '../../spacing';

interface Props {
  address: string;
}

const CopyIcon = (props: any) => <Icon {...props} name="clipboard-outline" />;

const copyTxt = 'Copy Address';
const copiedTxt = 'Copied to clipboard';

export const Receive = ({ address }: Props): React.ReactElement => {
  const styles = useStyleSheet(themedStyle);
  const [text, setText] = useState(copyTxt);

  const copy = () => {
    setText(copiedTxt);
    Clipboard.setString(address);
  };

  return (
    <Fragment>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text category="h4">Receive</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.qrCode}>
            <QRCode value={address} size={spacing[30]} />
          </View>
          <View style={styles.address}>
            <Button accessoryLeft={CopyIcon} onPress={copy}>
              {text}
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
  qrCode: {
    alignItems: 'center',
  },
  address: {
    paddingTop: spacing[2],
  },
});
