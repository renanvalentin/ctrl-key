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
import { LoadingIndicator } from '../../ui/LoadingIndicator';
import { FormData } from './data';

interface Props {
  calculatingFees?: boolean;
  onReviewPress: (formValue: FormData) => void;
}

export const Amount = ({
  calculatingFees,
  onReviewPress,
}: Props): React.ReactElement => {
  const [address, setAddress] = React.useState<string>('');
  const [amount, setAmount] = React.useState<string>('');

  const styles = useStyleSheet(themedStyles);

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.header}>
        <Text category="h4">Send</Text>
      </View>
      <Layout style={styles.formContainer} level="1">
        <Input
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <Input
          style={styles.amountInput}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />
      </Layout>
      {calculatingFees ? (
        <Button
          style={styles.reviewButton}
          appearance="outline"
          accessoryLeft={LoadingIndicator}>
          Calculating Fees
        </Button>
      ) : (
        <Button
          style={styles.reviewButton}
          size="giant"
          onPress={() => onReviewPress(new FormData(address, amount))}>
          Review transaction
        </Button>
      )}
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
  amountInput: {
    marginTop: spacing[3],
  },
  reviewButton: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
