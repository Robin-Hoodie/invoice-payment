import { currencyToSymbol } from "./currency-utils";

describe("Currency Utils", () => {
  it("should return '€' for the 'eur' currency", () => {
    expect(currencyToSymbol("eur")).toBe("€");
  });
});
