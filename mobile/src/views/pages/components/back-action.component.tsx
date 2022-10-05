import { useNavigation } from '@react-navigation/native';
import { Icon, IconElement, TopNavigationAction } from '@ui-kitten/components';
import React from 'react';
import { ImageStyle } from 'react-native';

const ArrowIosBackIcon = (style: any): IconElement => (
  <Icon {...style} name="arrow-ios-back" />
);

export const BackAction = (): React.ReactElement => {
  const navigation = useNavigation();
  return (
    <TopNavigationAction icon={ArrowIosBackIcon} onPress={navigation.goBack} />
  );
};
