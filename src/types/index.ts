export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  referralId?: string | null;
  lastPasswordChange?: Date | null;
  sessions: IUserSession[];
  freezed: boolean;
  fiat: IUserFiat;
}

export interface Token {
  _id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  supply: number;
  pair: string;
}

export interface UserToken {
  tokenId: string;
  amount: number;
}

export interface IUserFiat {
  usd_balance: number;
  eur_balance: number;
  gpb_balance: number;
}
export interface IUserSession {
  device: string | null;
  location: string | null;
  date: string | null;
  active: boolean;
}

export type FiatCurrency = "USD" | "EUR" | "GBP";
export type TokenCurrency = "BTC" | "ETH" | "USDT";

export type TransactionActionType = "BUY" | "SELL" | "WITHDRAW" | "DEPOSIT";

export type TransactionProvider = "PAYPAL" | "INTERNAL";

export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface ITransactionAction {
  action_type: TransactionActionType;
  provider: TransactionProvider;
}

export interface ITokenTransaction {
  token_type?: TokenCurrency;
  token_amount?: number;
}

export interface ITransactionType {
  fiat?: IFiatTransaction;
  token?: ITokenTransaction;
}
export interface IFiatTransaction {
  fiat_type?: FiatCurrency;
  fiat_amount?: number;
}

export interface IUserTransaction {
  _id: string;
  sender_id: {
    _id: string;
    email: string;
  };
  receiver_id?: {
    _id: string;
    email: string;
  };

  action: ITransactionAction;

  transaction_type: ITransactionType;

  status: TransactionStatus;

  createdAt: Date;
  updatedAt: Date;
}
