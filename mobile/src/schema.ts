export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Amount = {
  __typename?: 'Amount';
  lovelace: Scalars['String'];
};

export type Asset = {
  __typename?: 'Asset';
  name: Scalars['String'];
  quantity: Scalars['String'];
};

export type EncodedAsset = {
  hex: Scalars['String'];
  quantity: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  buildTx: TxBody;
  submitTx: TxResult;
  wallet: Wallet;
  wallets: Array<Wallet>;
};


export type QueryBuildTxArgs = {
  paymentAddress: Scalars['String'];
  stakeAddress: Scalars['String'];
  value: TxValue;
};


export type QuerySubmitTxArgs = {
  tx: Scalars['String'];
};


export type QueryWalletArgs = {
  stakeAddress: Scalars['String'];
};


export type QueryWalletsArgs = {
  stakeAddresses: Array<Scalars['String']>;
};

export type Tx = {
  __typename?: 'Tx';
  amount: Scalars['String'];
  date: Scalars['Int'];
  fees?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  type: TxDirection;
};

export type TxBody = {
  __typename?: 'TxBody';
  hex: Scalars['String'];
  summary: TxBodySummary;
  witnessesAddress: Array<Scalars['String']>;
};

export type TxBodySummary = {
  __typename?: 'TxBodySummary';
  fees: Scalars['String'];
  paymentAddresses: Array<TxOutput>;
};

export enum TxDirection {
  Incoming = 'Incoming',
  Outgoing = 'Outgoing'
}

export type TxOutput = {
  __typename?: 'TxOutput';
  address: Scalars['String'];
  amount: Amount;
};

export type TxResult = {
  __typename?: 'TxResult';
  hash: Scalars['String'];
};

export type TxValue = {
  assets: Array<EncodedAsset>;
  lovelace: Scalars['String'];
};

export type Wallet = {
  __typename?: 'Wallet';
  balance: Scalars['String'];
  marketPrice: Scalars['Float'];
  txs: Array<Tx>;
};
