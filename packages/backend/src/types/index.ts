export type CurrencyFiat = "nok" | "usd" | "eur" | "pound";
export type CurrencySymbol = "kr" | "$" | "€" | "£";
export type CurrencyCrypto = "btc";
export type Bit = "0" | "1";
export type Language = "en" | "nl";

export interface Address {
  street: string;
  postalCode: string;
  place: string; // usually needs translation
  country: string; // usually needs translation
}
