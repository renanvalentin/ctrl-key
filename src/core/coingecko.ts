import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/simple/',
  timeout: 1000,
});

interface API {
  price(): Promise<{ cardano: { usd: number } }>;
}

export const coingecko: API = {
  price: async () => {
    const { data } = await instance.get('price?ids=cardano&vs_currencies=usd');
    return data;
  },
};
