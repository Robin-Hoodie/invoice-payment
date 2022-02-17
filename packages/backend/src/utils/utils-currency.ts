import { CurrencyFiat, CurrencySymbol } from "@/types";

const currencyToSymbolMap: Record<CurrencyFiat, CurrencySymbol> = {
  eur: "€",
  nok: "kr",
  usd: "$",
  pound: "£",
};

export const currencyToSymbol = (currency: CurrencyFiat): CurrencySymbol =>
  currencyToSymbolMap[currency];
