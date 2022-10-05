import React from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  StyledComponentProps,
  LayoutProps,
  Layout,
  useTheme,
} from '@ui-kitten/components';

type Inset = 'top' | 'bottom';

export interface SafeAreaLayoutProps extends StyledComponentProps, LayoutProps {
  insets?: Inset;
  children?: React.ReactNode;
}

export const SafeAreaLayout: React.FC<SafeAreaLayoutProps> = ({
  insets,
  ...props
}) => {
  const theme = useTheme();
  const insetsConfig = useSafeAreaInsets();

  const backgroundColor: string =
    theme[`background-basic-color-${props.level}`];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout
        {...props}
        style={[
          props.style,
          backgroundColor ? { backgroundColor } : {},
          {
            paddingTop: insets === 'top' ? insetsConfig.top : 0,
            paddingBottom: insets === 'bottom' ? insetsConfig.bottom : 0,
          },
        ]}
      />
    </SafeAreaView>
  );
};
