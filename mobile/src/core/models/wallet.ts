import { CSL } from '../cardano-serialization-lib';
import { PendingTxModel, Props as SerializedPendingTx } from './pending-tx';

export interface SerializedWallet {
  __type: 'hot' | 'cold';
  id: string;
  name: string;
  encryptedRootKey: string;
  paymentVerificationKey: string;
  stakeVerificationKey: string;
  stakeAddress: string;
  pendingTxs: SerializedPendingTx[];
}

export type Bech32 = string;

export interface WalletModel {
  readonly id: string;
  readonly name: string;
  readonly encryptedRootKey: string;
  readonly paymentVerificationKey: Bech32;
  readonly stakeVerificationKey: Bech32;
  readonly stakeAddress: Bech32;
  readonly paymentAddresses: Bech32[];
  readonly pendingTxs: PendingTxModel[];
  tryUnlockPrivateKey(password: string): Promise<boolean>;
  serialize(): Promise<SerializedWallet>;
  signTx(
    txBody: string,
    password: string,
    witnessesAddress: string[],
  ): Promise<CSL.Transaction>;
}
