import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from '@apollo/client/link/http';
import { SERVER_URL } from './config';

export const createApolloClient = (
  fetch: WindowOrWorkerGlobalScope['fetch'],
) => {
  const uri = SERVER_URL;
  const httpLink = new HttpLink({ uri, fetch });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};
