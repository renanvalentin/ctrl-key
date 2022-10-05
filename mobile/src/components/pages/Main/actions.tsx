import React from 'react';
import { createStateContext } from 'react-use';
import { Subject } from 'rxjs';

export interface Actions {
  addWallet$: Subject<void>;
  onReceivePress$: Subject<void>;
  onSendPress$: Subject<void>;
  changeWallet$: Subject<number>;
}

const [hook, ActionsProvider] = createStateContext<Actions>({
  addWallet$: new Subject<void>(),
  onReceivePress$: new Subject<void>(),
  onSendPress$: new Subject<void>(),
  changeWallet$: new Subject<number>(),
});

interface Props {
  children: React.ReactNode;
}

export const Provider = ({ children }: Props) => {
  return <ActionsProvider>{children}</ActionsProvider>;
};

export const useActions = () => {
  const [state] = hook();
  return state;
};
