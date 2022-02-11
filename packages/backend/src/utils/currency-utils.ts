import { CurrencyFiat, CurrencySymbol } from "../types";

const currencyToSymbolMap: Record<CurrencyFiat, CurrencySymbol> = {
  eur: "€",
  usd: "$",
  nok: "kr",
};

export const currencyToSymbol = (currency: CurrencyFiat): CurrencySymbol =>
  currencyToSymbolMap[currency];
