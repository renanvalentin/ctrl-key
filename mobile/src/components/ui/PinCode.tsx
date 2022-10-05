import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 4;

interface Props {
  onFulfill: (value: string) => void;
  pin?: string;
  incorrect?: boolean;
}

export const PinCode = ({ onFulfill, pin, incorrect }: Props) => {
  const [value, setValue] = useState<string>('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const handleViewRef = useRef<Animatable.View & View>(null);

  useEffect(() => {
    if (value.length === CELL_COUNT && value !== pin && pin !== undefined) {
      handleViewRef?.current?.shake?.();
    }
  }, [value, pin, handleViewRef]);

  useEffect(() => {
    if (value.length === CELL_COUNT && incorrect) {
      handleViewRef?.current?.shake?.();
    }
  }, [value, incorrect, handleViewRef]);

  const renderCell = ({
    index,
    symbol,
    isFocused,
  }: {
    index: number;
    symbol: string;
    isFocused: boolean;
  }) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="*"
          isLastFilledCell={isLastFilledCell({ index, value })}>
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return <Text style={styles.cellText}>{textChild}</Text>;
  };

  return (
    <Animatable.View ref={handleViewRef}>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={v => {
          setValue(v);
          if (v.length === CELL_COUNT && v === pin) {
            onFulfill(v);
          } else if (v.length === CELL_COUNT && !pin) {
            onFulfill(v);
          }
        }}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}>
            {renderCell({ index, symbol, isFocused })}
          </View>
        )}
      />
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
});
