import React from 'react';
import { View } from 'react-native';
import {
  Button,
  Input,
  Layout,
  Spinner,
  StyleService,
  Text,
  useStyleSheet,
} from '@ui-kitten/components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { spacing } from '../../spacing';
import { FormData } from './data';

interface Props {
  connecting: boolean;
  onCreatePress: (formValue: FormData) => void;
}

export const NanoX = ({
  onCreatePress,
  connecting,
}: Props): React.ReactElement => {
  const [name, setName] = React.useState<string>('');

  const styles = useStyleSheet(themedStyles);

  if (connecting) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text category="h4">Nano X</Text>
        </View>
        <Layout style={styles.spinner} level="1">
          <Spinner size="giant" />
          <Text category="s1">connecting</Text>
        </Layout>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.header}>
        <Text category="h4">Nano X</Text>
      </View>
      <Layout style={styles.formContainer} level="1">
        <Input placeholder="Wallet name" value={name} onChangeText={setName} />
      </Layout>
      <Button
        style={styles.confirmButton}
        size="giant"
        onPress={() => onCreatePress(new FormData(name))}>
        Create
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
  spinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
});
