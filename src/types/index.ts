export interface User {
  id: string;
  email: string;
  name: string;
  fiatBalance: number;
}

export interface Token {
  _id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  supply: number;
  pair: string
}

export interface UserToken {
  tokenId: string;
  amount: number;
}
