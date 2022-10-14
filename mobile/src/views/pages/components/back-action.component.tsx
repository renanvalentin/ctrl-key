import { useNavigation } from '@react-navigation/native';
import { IconElement, TopNavigationAction } from '@ui-kitten/components';
import React from 'react';
import { Icon } from '../../../components/ui';

const ArrowIosBackIcon = (style: any): IconElement => (
  <Icon {...style} name="arrow-ios-back" />
);

export const BackAction = (): React.ReactElement => {
  const navigation = useNavigation();
  return (
    <TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
  );
};
