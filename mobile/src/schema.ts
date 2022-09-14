export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  wallet: Wallet;
};

export type QueryWalletArgs = {
  stakeAddress: Scalars['String'];
};

export type Tx = {
  __typename?: 'Tx';
  amount: Scalars['String'];
  date: Scalars['Int'];
  fees?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  type: TxDirection;
};

export enum TxDirection {
  Incoming = 'Incoming',
  Outgoing = 'Outgoing',
}

export type Wallet = {
  __typename?: 'Wallet';
  balance: Scalars['String'];
  txs: Array<Tx>;
};
