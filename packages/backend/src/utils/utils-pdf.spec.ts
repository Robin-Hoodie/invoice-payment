import { formatPriceForCurrency as formatPriceForCurrency } from "@/utils/utils-pdf";

describe("Utils PDF", () => {
  it("should format an 7-digit price with 3 fractional digits for the currency 'nok'", () => {
    expect(formatPriceForCurrency(1234567.89, "nok")).toBe("1,234,567.89 kr");
  });

  it("should format a 6-digit price with no fractional digits for the currency 'eur'", () => {
    expect(formatPriceForCurrency(123456, "eur")).toBe("€123,456.00");
  });
});
