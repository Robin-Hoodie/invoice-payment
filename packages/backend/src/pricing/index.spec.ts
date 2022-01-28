import {
  getSupportedCurrencies,
  getSupportedCoins,
  getPricesForCoinsInCurrencies,
} from "../clients/coin-gecko";
import { getPriceForBitcoinInCurrencyFiat } from "./index";

jest.mock("../clients/coin-gecko");
const mockGetSupportedCurrencies = jest.mocked(getSupportedCurrencies);
const mockGetSupportedCoins = jest.mocked(getSupportedCoins);
const mockGetPricesForCoinsInCurrencies = jest.mocked(
  getPricesForCoinsInCurrencies
);

describe("Pricing", () => {
  describe("getPriceForBitcoinInCurrencyFiat", () => {
    it("return a price of 1000 USD for 1 Bitcoin", async () => {
      mockGetSupportedCurrencies.mockResolvedValueOnce(["usd"]);
      mockGetSupportedCoins.mockResolvedValueOnce([
        { id: "bitcoin", symbol: "btc", name: "bitcoin" },
      ]);
      mockGetPricesForCoinsInCurrencies.mockResolvedValueOnce({
        bitcoin: {
          usd: 1000,
        },
      });
      const priceForBitcoinInUSD = await getPriceForBitcoinInCurrencyFiat(
        "usd"
      );
      expect(priceForBitcoinInUSD).toBe(1000);
    });

    it("should throw for the 'eur' currency, if it is not supported by the CoinGecko API", async () => {
      mockGetSupportedCurrencies.mockResolvedValueOnce(["usd"]);
      await expect(
        async () => await getPriceForBitcoinInCurrencyFiat("nok")
      ).rejects.toThrow(/currency/i);
    });

    it("should throw if the coin with symbol 'btc' is not supported the CoinGecko API", async () => {
      mockGetSupportedCurrencies.mockResolvedValueOnce(["usd"]);
      mockGetSupportedCoins.mockResolvedValueOnce([]);
      await expect(
        async () => await getPriceForBitcoinInCurrencyFiat("usd")
      ).rejects.toThrow(/btc/);
    });
  });
});
