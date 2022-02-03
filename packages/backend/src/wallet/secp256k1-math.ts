import { modInv } from "bigint-mod-arith";

/**
 * A lot of the math and numbers here come from https://learnmeabitcoin.com/technical/ecdsa
 * These functions exist in other libraries (e.g. tiny-secp256k1), but are mostly reproduced in order for
 * the author to get a better grasp on the math behind Bitcoin.
 * As we use "bigint-mod-arith" and as noted in its README, the math used here is not constant time
 * and should thus not be used with private keys.
 **/

export const ORDER =
  115792089237316195423570985008687907852837564279074904382605163141518161494337n;

export const PRIME_MODULUS =
  2n ** 256n -
  2n ** 32n -
  2n ** 9n -
  2n ** 8n -
  2n ** 7n -
  2n ** 6n -
  2n ** 4n -
  1n;

const GENERATOR_POINT_X = Buffer.from(
  "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
  "hex"
);
const GENERATOR_POINT_Y = Buffer.from(
  "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
  "hex"
);
const GENERATOR_POINT_PREFIX = Buffer.from("04", "hex");

export const GENERATOR_POINT = Buffer.concat([
  GENERATOR_POINT_PREFIX,
  GENERATOR_POINT_X,
  GENERATOR_POINT_Y,
]);

const extractXAndYAsBigInt = (point: Uint8Array) => {
  return {
    x: BigInt(`0x${Buffer.from(point.slice(1, 1 + 256 / 8)).toString("hex")}`),
    y: BigInt(`0x${Buffer.from(point.slice(1 + 256 / 8)).toString("hex")}`),
  };
};

const bigIntTo32ByteHex = (number: bigint) =>
  number.toString(16).padStart(32, "0");

/**
 * This accounts for modulo of negative numbers, see below:
 * https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers#answer-17323608
 **/
const moduloPrimeModulus = (number: bigint) => {
  return ((number % PRIME_MODULUS) + PRIME_MODULUS) % PRIME_MODULUS;
};

const pointAsBuffer = (pointX: bigint, pointY: bigint, compressed: boolean) => {
  const pointXHex = bigIntTo32ByteHex(pointX);
  if (compressed) {
    const pointYEven = pointY % 2n === 0n;
    const prefix = pointYEven ? "02" : "03";
    return Buffer.from(`${prefix}${pointXHex}`, "hex");
  }
  const prefix = "04";
  const pointYHex = bigIntTo32ByteHex(pointY);
  return Buffer.from(`${prefix}${pointXHex}${pointYHex}`, "hex");
};

export const pointDouble = (point: Uint8Array, compressed = false) => {
  const { x, y } = extractXAndYAsBigInt(point);
  const slope = moduloPrimeModulus(
    3n * x ** 2n * modInv(2n * y, PRIME_MODULUS)
  );
  const doubledPointX = moduloPrimeModulus(slope ** 2n - 2n * x);
  const doubledPointY = moduloPrimeModulus(
    (slope * (x - doubledPointX) - y) % PRIME_MODULUS
  );
  return pointAsBuffer(doubledPointX, doubledPointY, compressed);
};

export const pointAdd = (
  pointOne: Uint8Array,
  pointTwo: Uint8Array,
  compressed = false
) => {
  if (Buffer.from(pointOne).equals(Buffer.from(pointTwo))) {
    return pointDouble(pointOne);
  }

  const { x: pointOneX, y: pointOneY } = extractXAndYAsBigInt(pointOne);
  const { x: pointTwoX, y: pointTwoY } = extractXAndYAsBigInt(pointTwo);
  const slope = moduloPrimeModulus(
    (pointOneY - pointTwoY) * modInv(pointOneX - pointTwoX, PRIME_MODULUS)
  );
  const sumPointX = moduloPrimeModulus(slope ** 2n - pointOneX - pointTwoX);
  const sumPointY = moduloPrimeModulus(
    slope * (pointOneX - sumPointX) - pointOneY
  );
  return pointAsBuffer(sumPointX, sumPointY, compressed);
};
