import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/simple/',
  timeout: 1000,
});

export interface Price {
  cardano: { usd: number };
}

interface API {
  price(currency: string): Promise<Price>;
}

export const coingecko: API = {
  price: async (currency: string = 'usd') => {
    const { data } = await instance.get(
      `price?ids=cardano&vs_currencies=${currency}`,
    );
    return data;
  },
};
