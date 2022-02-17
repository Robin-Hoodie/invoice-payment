import {
  getOffsetsX,
  formatPriceForCurrency as formatPriceForCurrency,
} from "./utils-pdf";

describe("Utils PDF", () => {
  it("should get the offsets on the X axis based on the doc width", () => {
    const doc = {
      internal: {
        pageSize: {
          getWidth: () => 100,
        },
      },
    } as Parameters<typeof getOffsetsX>[0];
    expect(getOffsetsX(doc)).toEqual({
      LEFT: 10,
      MIDDLE_LEFT: 26,
      MIDDLE: 42,
      MIDDLE_RIGHT: 58,
      RIGHT: 74,
    });
  });

  it("should format an 7-digit price with 3 fractional digits for the currency 'nok'", () => {
    expect(formatPriceForCurrency(1234567.89, "nok")).toBe("1,234,567.89 kr");
  });

  it("should format a 6-digit price with no fractional digits for the currency 'eur'", () => {
    expect(formatPriceForCurrency(123456, "eur")).toBe("€123,456.00");
  });
});
