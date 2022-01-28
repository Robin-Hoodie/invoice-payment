import { CurrencyFiat } from "../types";
import {
  getSupportedCurrencies,
  getSupportedCoins,
  getPricesForCoinsInCurrencies,
} from "../clients/coin-gecko";

const isSupportedCurrency = (
  supportedCurrencies: string[],
  currency: string
): currency is CurrencyFiat => supportedCurrencies.includes(currency);

export const getPriceForBitcoinInCurrencyFiat = async (currency: string) => {
  const supportedCurrencies = await getSupportedCurrencies();
  if (!isSupportedCurrency(supportedCurrencies, currency)) {
    throw new Error(
      `Currency ${currency} is not supported by the CoinGecko API`
    );
  }

  const supportedCoins = await getSupportedCoins();
  const supportedCoinBitcoin = supportedCoins.find(
    (supportedCoin) => supportedCoin.symbol === "btc"
  );
  if (!supportedCoinBitcoin) {
    throw new Error(
      `Coin with symbol 'btc' is not supported by the CoinGecko API`
    );
  }
  const { id: bitcoinId } = supportedCoinBitcoin;

  const pricesForCoinsInCurrencies = await getPricesForCoinsInCurrencies(
    [bitcoinId],
    [currency]
  );
  return pricesForCoinsInCurrencies[bitcoinId][currency];
};
