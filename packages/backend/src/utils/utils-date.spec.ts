import { formatDayMonthYear } from "@/utils/utils-date";

describe("Date Utils", () => {
  it("should format the date as 30-01-2020", () => {
    expect(formatDayMonthYear(new Date(2020, 0, 30))).toBe("30-01-2020");
  });
});
