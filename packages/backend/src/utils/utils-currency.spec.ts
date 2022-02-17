import { currencyToSymbol } from "@/utils/utils-currency";

describe("Currency Utils", () => {
  it("should return '€' for the 'eur' currency", () => {
    expect(currencyToSymbol("eur")).toBe("€");
  });
});
