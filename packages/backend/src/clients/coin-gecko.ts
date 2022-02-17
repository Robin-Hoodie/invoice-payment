import { httpClient } from "@/http-client";
import { CurrencyFiat } from "@/types";
import { SupportedCoin, CoinToCurrencyToPrice } from "@/clients/types-clients";

const COIN_GECKO_BASE_URL = "https://api.coingecko.com/api/v3";
const COIN_GECKO_URLS = {
  SUPPORTED_CURRENCIES: `${COIN_GECKO_BASE_URL}/simple/supported_vs_currencies`,
  SUPPORTED_COINS: `${COIN_GECKO_BASE_URL}/coins/list`,
  PRICE: `${COIN_GECKO_BASE_URL}/simple/price`,
};

export const getSupportedCurrencies = async () =>
  await httpClient.get<string[], string[]>(
    COIN_GECKO_URLS.SUPPORTED_CURRENCIES
  );

export const getSupportedCoins = async () =>
  await httpClient.get<SupportedCoin[], SupportedCoin[]>(
    COIN_GECKO_URLS.SUPPORTED_COINS
  );

export const getPricesForCoinsInCurrencies = async (
  coins: string[],
  currencies: CurrencyFiat[]
) =>
  await httpClient.get<CoinToCurrencyToPrice, CoinToCurrencyToPrice>(
    COIN_GECKO_URLS.PRICE,
    {
      params: {
        ids: coins.join(","),
        vs_currencies: currencies.join(","),
      },
      cache: false,
    }
  );
