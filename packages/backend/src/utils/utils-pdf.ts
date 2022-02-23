import { Customer } from "@/db/types-customers";
import { Payee } from "@/db/types-payees";
import { CurrencyFiat } from "@/types";
import { currencyToSymbol } from "@/utils/utils-currency";
import { NestedPick } from "@/types/types-utility";

export const formatPriceForCurrency = (
  price: number,
  currency: CurrencyFiat
) => {
  const currencySymbol = currencyToSymbol(currency);
  const fractionDigits = price.toFixed(2).slice(-2);
  const priceFormattedWithoutFractionDigits = Math.floor(price)
    .toString()
    .split("")
    .reverse()
    .reduce((priceFormatted, digit, i) => {
      const insertComma = i === 0 ? false : i % 3 === 0;
      return `${digit}${insertComma ? "," : ""}${priceFormatted}`;
    }, "");
  const priceFormatted = `${priceFormattedWithoutFractionDigits}.${fractionDigits}`;
  if (currencySymbol === "kr") {
    return `${priceFormatted} ${currencySymbol}`;
  }
  return `${currencySymbol}${priceFormatted}`;
};

const VAT_PERCENTAGE_DOMESTIC = 21;

export const getVatPercentage = (
  customer: NestedPick<Customer, "address", "country">,
  payee: NestedPick<Payee, "address", "country">
) =>
  customer.address.country === payee.address.country
    ? VAT_PERCENTAGE_DOMESTIC
    : 0;
