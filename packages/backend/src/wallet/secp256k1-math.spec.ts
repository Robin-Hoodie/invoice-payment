import { pointAdd as pointAddTinySecp256k1 } from "tiny-secp256k1";
import { GENERATOR_POINT, pointDouble, pointAdd } from "./secp256k1-math";

// We're using the tiny-secp256k1 to verify

// TODO: uncompressed w/ uncompress function?
export const GENERATOR_POINT_UNCOMPRESSED = Buffer.concat([
  Buffer.from("02", "hex"),
  GENERATOR_POINT.slice(1, 1 + 256 / 8),
]);

describe("Secp256k1 Mathematics", () => {
  it("should return the result of doubling a point as an uncompressed point", () => {
    const pointDoubledActual = pointDouble(GENERATOR_POINT, {
      compressed: false,
    });
    const pointDoubledExpected = pointAddTinySecp256k1(
      GENERATOR_POINT,
      GENERATOR_POINT,
      false
    );
    expect(pointDoubledActual.toString("hex")).toBe(
      pointDoubledExpected.toString("hex")
    );
  });

  it("should return the result of doubling as a compressed point", () => {
    const pointDoubledActual = pointDouble(GENERATOR_POINT, {
      compressed: true,
    });
    const pointDoubledExpected = pointAddTinySecp256k1(
      GENERATOR_POINT,
      GENERATOR_POINT,
      true
    );
    expect(pointDoubledActual.toString("hex")).toBe(
      pointDoubledExpected.toString("hex")
    );
  });

  it("should be able to handle doubling a compressed point and returning it as an uncompressed point", () => {
    const pointDoubledActual = pointDouble(GENERATOR_POINT_UNCOMPRESSED, {
      compressed: false,
    });
    const pointDoubledExpect = pointAddTinySecp256k1(
      GENERATOR_POINT,
      GENERATOR_POINT,
      false
    );
    expect(pointDoubledActual.toString("hex")).toBe(
      pointDoubledExpect.toString("hex")
    );
  });

  it("should be able to handle doubling a compressed point and returning is as a compressed point", () => {
    const pointDoubledActual = pointDouble(GENERATOR_POINT_UNCOMPRESSED, {
      compressed: true,
    });
    const pointDoubledExpect = pointAddTinySecp256k1(
      GENERATOR_POINT,
      GENERATOR_POINT,
      true
    );
    expect(pointDoubledActual.toString("hex")).toBe(
      pointDoubledExpect.toString("hex")
    );
  });

  it("should return the sum of 2 points as an uncompressed point", () => {
    const pointA = pointDouble(GENERATOR_POINT, { compressed: false });
    const pointB = pointDouble(
      pointDouble(GENERATOR_POINT, { compressed: false }),
      { compressed: false }
    );
    const pointSumActual = pointAdd(pointA, pointB, { compressed: false });
    const pointSumExpected = pointAddTinySecp256k1(pointA, pointB, false);
    expect(pointSumActual.toString("hex")).toBe(
      pointSumExpected.toString("hex")
    );
  });

  it("should return the sum of 2 points as a compressed point", () => {
    const pointA = pointDouble(GENERATOR_POINT, { compressed: false });
    const pointB = pointDouble(
      pointDouble(GENERATOR_POINT, { compressed: false }),
      { compressed: false }
    );
    const pointSumActual = pointAdd(pointA, pointB, { compressed: true });
    const pointSumExpected = pointAddTinySecp256k1(pointA, pointB, true);
    expect(pointSumActual.toString("hex")).toBe(
      pointSumExpected.toString("hex")
    );
  });

  it("should be able to handle adding two uncompressed points and returning the sum as an uncompressed point", () => {
    const pointA = pointDouble(GENERATOR_POINT, { compressed: true });
    const pointB = pointDouble(
      pointDouble(GENERATOR_POINT, { compressed: true }),
      { compressed: true }
    );
    const pointSumActual = pointAdd(pointA, pointB, { compressed: false });
    const pointSumExpected = pointAddTinySecp256k1(pointA, pointB, false);
    expect(pointSumActual.toString("hex")).toBe(
      pointSumExpected.toString("hex")
    );
  });

  it("should be able to handle adding two uncompressed point and returning the sum as a compressed point", () => {
    const pointA = pointDouble(GENERATOR_POINT, { compressed: false });
    const pointB = pointDouble(
      pointDouble(GENERATOR_POINT, { compressed: false }),
      { compressed: false }
    );
    const pointSumActual = pointAdd(pointA, pointB, { compressed: true });
    const pointSumExpected = pointAddTinySecp256k1(pointA, pointB, true);
    expect(pointSumActual.toString("hex")).toBe(
      pointSumExpected.toString("hex")
    );
  });
});
