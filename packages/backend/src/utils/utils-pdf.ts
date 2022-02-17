import jsPDF from "jspdf";
import { CurrencyFiat } from "@/types";
import { currencyToSymbol } from "@/utils/utils-currency";

const round = (number: number, fractionDigits = 2) =>
  Number(number.toFixed(fractionDigits));

export const getOffsetsX = ({
  internal: { pageSize },
}: Pick<jsPDF, "internal">) => {
  const docWidth = pageSize.getWidth();
  return {
    LEFT: round(docWidth * 0.1),
    MIDDLE_LEFT: round(docWidth * 0.26),
    MIDDLE: round(docWidth * 0.42),
    MIDDLE_RIGHT: round(docWidth * 0.58),
    RIGHT: round(docWidth * 0.74),
  };
};

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
