import { useLazyQuery, gql, useApolloClient } from '@apollo/client';
import { useAppStore } from '../../store';
import {
  Query,
  QueryBuildTxArgs,
  QuerySubmitTxArgs,
  TxBody,
  TxResult,
} from '@ctrl-k/schema';

// const GET_BUILD_TX = gql`
//   query GetBuildTx(
//     $stakeAddress: String!
//     $paymentAddress: String!
//     $value: TxValue!
//   ) {
//     buildTx(
//       stakeAddress: $stakeAddress
//       paymentAddress: $paymentAddress
//       value: $value
//     ) {
//       hex
//       witnessesAddress
//     }
//   }
// `;

// const GET_SUBMIT_TX = gql`
//   query GetSubmitTx($tx: String!) {
//     submitTx(tx: $tx) {
//       hash
//     }
//   }
// `;

interface SubmitTxPayload {
  paymentAddress: string;
  amount: string;
  password: string;
}

export const useSubmitTx = (walletId: string) => {
  const wallet = useAppStore(state => state.getWalletById(walletId));
  const client = useApolloClient();

  return async ({ paymentAddress, amount, password }: SubmitTxPayload) => {
    // const {
    //   data: {
    //     buildTx: { hex, witnessesAddress },
    //   },
    // } = await client.query<{ buildTx: Query['buildTx'] }, QueryBuildTxArgs>({
    //   query: GET_BUILD_TX,
    //   variables: {
    //     paymentAddress: paymentAddress,
    //     stakeAddress: wallet.stakeAddress,
    //     value: { lovelace: amount, assets: [] },
    //   },
    // });
    // const tx = await wallet.signTx(hex, password, witnessesAddress);
    // const txBytes = await tx.to_bytes();
    // const {
    //   data: {
    //     submitTx: { hash },
    //   },
    // } = await client.query<{ submitTx: Query['submitTx'] }, QuerySubmitTxArgs>({
    //   query: GET_SUBMIT_TX,
    //   variables: {
    //     tx: Buffer.from(txBytes).toString('hex'),
    //   },
    // });
    // return { hash, walletId: wallet.id };
  };
};
