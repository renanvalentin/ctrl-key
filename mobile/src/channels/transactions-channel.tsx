import { useEffect } from 'react';
import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';
import { Subject } from 'rxjs';
import { PUSHER_CLUSTER, PUSHER_API_KEY } from '../config';
import { useAppStore } from '../store';
import { useSubscription } from 'observable-hooks';
import { HotWallet, LedgerWallet } from '@ctrlK/core';

const pusher = Pusher.getInstance();

const txs$ = new Subject<string>();

export const TransactionsChannel = () => {
  const wallets = useAppStore(state => state.wallets);
  const updateWallet = useAppStore(state => state.updateWallet);

  useEffect(() => {
    const doSubscribe = async () => {
      await pusher.init({
        apiKey: PUSHER_API_KEY,
        cluster: PUSHER_CLUSTER,
      });

      await pusher.connect();
      await pusher.subscribe({
        channelName: 'cardano',
        onEvent: (event: PusherEvent) => {
          txs$.next(event.data);
        },
      });
    };

    doSubscribe();
  }, []);

  useSubscription(txs$, tx => {
    const updatedWallets = wallets
      .map(w => {
        const shouldUdpate = w.pendingTxs.find(p => p.id === tx);

        if (!shouldUdpate) {
          return {
            shouldUdpate,
            w,
          };
        }

        const pendingTxs = w.pendingTxs.filter(p => p.id !== tx);

        if (w instanceof HotWallet) {
          return {
            w: new HotWallet({
              ...w,
              pendingTxs,
            }),
            shouldUdpate,
          };
        }

        return {
          w: new LedgerWallet({
            ...w,
            pendingTxs,
          }),
          shouldUdpate,
        };
      })
      .filter(r => r.shouldUdpate)
      .map(r => r.w);

    updatedWallets.forEach(w => updateWallet(w));
  });

  return null;
};
