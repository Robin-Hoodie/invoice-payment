export interface SupportedCoin {
  id: string;
  symbol: string;
  name: string;
}

export type CoinToCurrencyToPrice = Record<string, Record<string, number>>;
