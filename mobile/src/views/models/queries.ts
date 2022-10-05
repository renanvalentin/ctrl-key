import { gql } from '@apollo/client';

export const GET_BUILD_TX = gql`
  query GetBuildTx(
    $stakeAddress: String!
    $paymentAddress: String!
    $value: TxValue!
  ) {
    buildTx(
      stakeAddress: $stakeAddress
      paymentAddress: $paymentAddress
      value: $value
    ) {
      hex
      witnessesAddress
      summary {
        fees
        paymentAddresses {
          address
          amount {
            lovelace
          }
        }
      }
    }
  }
`;

export const GET_WALLETS = gql`
  query GetWallets($stakeAddresses: [String!]!) {
    wallets(stakeAddresses: $stakeAddresses) {
      balance
      marketPrice
    }
  }
`;

export const GET_TXS = gql`
  query GetTxs($stakeAddress: String!) {
    wallet(stakeAddress: $stakeAddress) {
      txs {
        type
        amount
        fees
        date
        id
      }
    }
  }
`;

export const GET_SUBMIT_TX = gql`
  query GetSubmitTx($tx: String!) {
    submitTx(tx: $tx) {
      hash
    }
  }
`;
