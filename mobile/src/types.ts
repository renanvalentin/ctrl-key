import { Pages } from './components';
import { DeviceInfo } from './core';
import { TxBody, UnsignedTx } from './views/models';

export type RootStackParamList = {
  RestoreWallet: undefined;
  NanoX: undefined;
  NanoXPassword: { deviceInfo: DeviceInfo };
  AddWallet: undefined;
  RestoreWalletPassword: { formData: Pages.RestoreWallet.Types.FormData };
  Main: undefined;
  Summary: { walletId: string };
  Send: { walletId: string };
  SendAmount: { walletId: string };
  SendSummary: { walletId: string; txBody: TxBody };
  SendPassword: { walletId: string; txBody: TxBody };
  Processing: { walletId: string; unsingedTx: UnsignedTx; txBody: TxBody };
  Receive: { walletId: string };
};
