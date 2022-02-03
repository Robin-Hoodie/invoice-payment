import { pointAdd as pointAddTinySecp256k1 } from "tiny-secp256k1";
import { GENERATOR_POINT, pointDouble, pointAdd } from "./secp256k1-math";

describe("Secp256k1 Mathematics", () => {
  it("should return the result of doubling a point as an uncompressed point", () => {
    const pointDoubledActual = pointDouble(GENERATOR_POINT, false);
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
    const pointDoubledActual = pointDouble(GENERATOR_POINT, true);
    const pointDoubledExpected = pointAddTinySecp256k1(
      GENERATOR_POINT,
      GENERATOR_POINT,
      true
    );
    expect(pointDoubledActual.toString("hex")).toBe(
      pointDoubledExpected.toString("hex")
    );
  });

  it("should return the sum of 2 points as an uncompressed point", () => {
    const pointA = pointDouble(GENERATOR_POINT, false);
    const pointB = pointDouble(pointDouble(GENERATOR_POINT, false), false);
    const pointSumActual = pointAdd(pointA, pointB, false);
    const pointSumExpected = pointAddTinySecp256k1(pointA, pointB, false);
    expect(pointSumActual.toString("hex")).toBe(
      pointSumExpected.toString("hex")
    );
  });

  it("should return the sum of 2 points as a compressed point", () => {
    const pointA = pointDouble(GENERATOR_POINT, false);
    const pointB = pointDouble(pointDouble(GENERATOR_POINT, false), false);
    const pointSumActual = pointAdd(pointA, pointB, true);
    const pointSumExpected = pointAddTinySecp256k1(pointA, pointB, true);
    expect(pointSumActual.toString("hex")).toBe(
      pointSumExpected.toString("hex")
    );
  });
});
