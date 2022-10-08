import { GraphQLResolveInfo } from 'graphql';
import { WalletModel } from './core/models/wallet';
import { Context } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type Subscription = {
  __typename?: 'Subscription';
  pendingTxs: TxResult;
};


export type SubscriptionPendingTxsArgs = {
  txHash: Scalars['String'];
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Amount: ResolverTypeWrapper<Amount>;
  Asset: ResolverTypeWrapper<Asset>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  EncodedAsset: EncodedAsset;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  Tx: ResolverTypeWrapper<Tx>;
  TxBody: ResolverTypeWrapper<TxBody>;
  TxBodySummary: ResolverTypeWrapper<TxBodySummary>;
  TxDirection: TxDirection;
  TxOutput: ResolverTypeWrapper<TxOutput>;
  TxResult: ResolverTypeWrapper<TxResult>;
  TxValue: TxValue;
  Wallet: ResolverTypeWrapper<WalletModel>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Amount: Amount;
  Asset: Asset;
  Boolean: Scalars['Boolean'];
  EncodedAsset: EncodedAsset;
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  Query: {};
  String: Scalars['String'];
  Subscription: {};
  Tx: Tx;
  TxBody: TxBody;
  TxBodySummary: TxBodySummary;
  TxOutput: TxOutput;
  TxResult: TxResult;
  TxValue: TxValue;
  Wallet: WalletModel;
};

export type AmountResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Amount'] = ResolversParentTypes['Amount']> = {
  lovelace?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssetResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Asset'] = ResolversParentTypes['Asset']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  buildTx?: Resolver<ResolversTypes['TxBody'], ParentType, ContextType, RequireFields<QueryBuildTxArgs, 'paymentAddress' | 'stakeAddress' | 'value'>>;
  submitTx?: Resolver<ResolversTypes['TxResult'], ParentType, ContextType, RequireFields<QuerySubmitTxArgs, 'tx'>>;
  wallet?: Resolver<ResolversTypes['Wallet'], ParentType, ContextType, RequireFields<QueryWalletArgs, 'stakeAddress'>>;
  wallets?: Resolver<Array<ResolversTypes['Wallet']>, ParentType, ContextType, RequireFields<QueryWalletsArgs, 'stakeAddresses'>>;
};

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  pendingTxs?: SubscriptionResolver<ResolversTypes['TxResult'], "pendingTxs", ParentType, ContextType, RequireFields<SubscriptionPendingTxsArgs, 'txHash'>>;
};

export type TxResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Tx'] = ResolversParentTypes['Tx']> = {
  amount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  fees?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TxDirection'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TxBodyResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TxBody'] = ResolversParentTypes['TxBody']> = {
  hex?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['TxBodySummary'], ParentType, ContextType>;
  witnessesAddress?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TxBodySummaryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TxBodySummary'] = ResolversParentTypes['TxBodySummary']> = {
  fees?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paymentAddresses?: Resolver<Array<ResolversTypes['TxOutput']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TxOutputResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TxOutput'] = ResolversParentTypes['TxOutput']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['Amount'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TxResultResolvers<ContextType = Context, ParentType extends ResolversParentTypes['TxResult'] = ResolversParentTypes['TxResult']> = {
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WalletResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Wallet'] = ResolversParentTypes['Wallet']> = {
  balance?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  marketPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  txs?: Resolver<Array<ResolversTypes['Tx']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Amount?: AmountResolvers<ContextType>;
  Asset?: AssetResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Tx?: TxResolvers<ContextType>;
  TxBody?: TxBodyResolvers<ContextType>;
  TxBodySummary?: TxBodySummaryResolvers<ContextType>;
  TxOutput?: TxOutputResolvers<ContextType>;
  TxResult?: TxResultResolvers<ContextType>;
  Wallet?: WalletResolvers<ContextType>;
};

