import { getOffsetsX } from "@/pdf/helpers/layout";

describe("Layout", () => {
  it("should get the offsets on the X axis based on the doc width", () => {
    const doc = {
      getBounds: () => ({
        width: 100,
        height: 100,
      }),
    };
    expect(getOffsetsX(doc)).toEqual({
      LEFT: 10,
      MIDDLE_LEFT: 26,
      MIDDLE: 42,
      MIDDLE_RIGHT: 58,
      RIGHT: 74,
    });
  });
});
