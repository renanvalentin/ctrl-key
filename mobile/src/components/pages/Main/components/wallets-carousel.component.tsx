import React from 'react';
import { Dimensions } from 'react-native';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { AddWallet } from './add-wallet.component';
import { Wallet } from './wallet.component';
import * as Data from '../data';
import { spacing } from '../../../spacing';
import { useStateContext, useSetActiveWallet } from '../context';
import { useActions } from '../actions';

const PAGE_WIDTH = Dimensions.get('window').width;

const renderCarouselItem = (index: number): React.ReactElement => {
  const [state] = useStateContext();
  const item = state.wallets[index];

  return item instanceof Data.Wallet ? (
    <Wallet wallet={item as Data.Wallet} key={item.id} />
  ) : (
    <AddWallet key="add-wallet" />
  );
};

export const WalletsCarousel = (): React.ReactElement => {
  const [state] = useStateContext();
  const ref = React.useRef<ICarouselInstance>(null);
  const actions = useActions();
  const setActiveWallet = useSetActiveWallet();

  const baseOptions = {
    vertical: false,
    width: PAGE_WIDTH * 0.85,
    height: spacing[18],
  } as const;

  return (
    <Carousel
      {...baseOptions}
      ref={ref}
      style={{ width: '100%' }}
      data={[...state.wallets, new Data.CallToAction()]}
      loop={false}
      pagingEnabled={true}
      key={state.wallets.length}
      onSnapToItem={index => {
        if (index < state.wallets.length) {
          actions.changeWallet$.next(index);
          setActiveWallet(index);
        }
      }}
      renderItem={({ index }) => renderCarouselItem(index)}
    />
  );
};
