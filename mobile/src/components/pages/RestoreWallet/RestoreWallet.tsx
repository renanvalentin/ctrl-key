import React from 'react';
import { View } from 'react-native';
import {
  Button,
  Input,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { spacing } from '../../spacing';
import { FormData } from './data';

interface Props {
  onRestorePress: (formValue: FormData) => void;
}

export const RestoreWallet = ({
  onRestorePress,
}: Props): React.ReactElement => {
  const [name, setName] = React.useState<string>('');
  const [mnemonic, setMnemonic] = React.useState<string>('');

  const styles = useStyleSheet(themedStyles);

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.header}>
        <Text category="h4">Restore Wallet</Text>
      </View>
      <Layout style={styles.formContainer} level="1">
        <Input placeholder="Wallet name" value={name} onChangeText={setName} />
        <Input
          style={styles.mnemonicInput}
          placeholder="Mnemonic"
          value={mnemonic}
          onChangeText={setMnemonic}
          multiline
          numberOfLines={4}
        />
      </Layout>
      <Button
        style={styles.confirmButton}
        size="giant"
        onPress={() => onRestorePress(new FormData(name, mnemonic))}>
        Restore
      </Button>
    </KeyboardAwareScrollView>
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
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[3],
  },
  mnemonicInput: {
    marginTop: spacing[3],
  },
  confirmButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
});
