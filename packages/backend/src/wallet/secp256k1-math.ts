import { modInv, modPow } from "bigint-mod-arith";

/**
 * A lot of the math and numbers here come from https://learnmeabitcoin.com/technical/ecdsa & https://learnmeabitcoin.com/technical/public-key
 * These functions exist in other libraries (e.g. tiny-secp256k1),
 * but are mostly reproduced in order for the author to get a better grasp on the math behind Bitcoin.
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

export const GENERATOR_POINT = Buffer.concat([
  Buffer.from("04", "hex"),
  GENERATOR_POINT_X,
  GENERATOR_POINT_Y,
]);

const extractX = (point: Buffer) =>
  BigInt(`0x${point.slice(1, 1 + 256 / 8).toString("hex")}`);

const extractY = (point: Buffer) =>
  BigInt(`0x${point.slice(1 + 256 / 8).toString("hex")}`);

const extractCoordinates = (point: Buffer) => {
  return {
    x: extractX(point),
    y: extractY(point),
  };
};

const bigIntTo32ByteHex = (number: bigint) =>
  number.toString(16).padStart(32, "0");

/**
 * This accounts for modulo of negative numbers, see below:
 * https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers#answer-17323608
 **/
const modulo = (number: bigint, modulus = PRIME_MODULUS) => {
  return ((number % modulus) + modulus) % modulus;
};

const pointIsCompressed = (point: Buffer) => {
  const prefix = point.slice(0, 1).toString("hex");
  if (prefix === "02" || prefix === "03") {
    if (point.length === 264 / 8) {
      return true;
    }
    throw new Error(
      `Point ${point.toString(
        "hex"
      )} has the correct prefix (${prefix}) but does not have a length of 264 bits (${
        point.length * 8
      } bits)`
    );
  }
  if (prefix === "04") {
    if (point.length === 520 / 8) {
      return false;
    }
    throw new Error(
      `Point ${point.toString(
        "hex"
      )} has the correct prefix (${prefix}) but does not have a length of 520 bits (${
        point.length * 8
      })`
    );
  }
  throw new Error(
    `Point ${point.toString("hex")} does not have a '02', '03' or '04' prefix`
  );
};

// See https://learnmeabitcoin.com/technical/public-key#how-to-decompress-a-public-key
const uncompressPoint = (point: Buffer) => {
  if (pointIsCompressed(point)) {
    const prefix = point.slice(0, 1).toString("hex");
    const x = extractX(point);
    const ySquared = modulo(x ** 3n + 7n);
    let y = modPow(ySquared, (PRIME_MODULUS + 1n) / 4n, PRIME_MODULUS);
    if (prefix === "02" && modulo(y, 2n) !== 0n) {
      y = modulo(PRIME_MODULUS - y);
    }
    if (prefix === "03" && modulo(y, 2n) === 0n) {
      y = modulo(PRIME_MODULUS - y);
    }
    return Buffer.concat([
      Buffer.from("04", "hex"),
      Buffer.from(bigIntTo32ByteHex(x), "hex"),
      Buffer.from(bigIntTo32ByteHex(y), "hex"),
    ]);
  }
  return point;
};

const pointAsBuffer = (pointX: bigint, pointY: bigint, compressed: boolean) => {
  const pointXHex = bigIntTo32ByteHex(pointX);
  if (compressed) {
    const pointYEven = modulo(pointY, 2n) === 0n;
    const prefix = pointYEven ? "02" : "03";
    return Buffer.from(`${prefix}${pointXHex}`, "hex");
  }
  const prefix = "04";
  const pointYHex = bigIntTo32ByteHex(pointY);
  return Buffer.from(`${prefix}${pointXHex}${pointYHex}`, "hex");
};

export const pointDouble = (
  point: Buffer,
  { compressed } = { compressed: false }
) => {
  const pointUncompressed = uncompressPoint(point);
  const { x, y } = extractCoordinates(pointUncompressed);
  const slope = modulo(3n * x ** 2n * modInv(2n * y, PRIME_MODULUS));
  const doubledPointX = modulo(slope ** 2n - 2n * x);
  const doubledPointY = modulo(slope * (x - doubledPointX) - y);
  return pointAsBuffer(doubledPointX, doubledPointY, compressed);
};

export const pointAdd = (
  pointOne: Buffer,
  pointTwo: Buffer,
  { compressed } = { compressed: false }
) => {
  if (Buffer.from(pointOne).equals(Buffer.from(pointTwo))) {
    return pointDouble(pointOne, { compressed });
  }
  const pointOneUncompressed = uncompressPoint(pointOne);
  const pointTwoUncompressed = uncompressPoint(pointTwo);
  const { x: pointOneX, y: pointOneY } =
    extractCoordinates(pointOneUncompressed);
  const { x: pointTwoX, y: pointTwoY } =
    extractCoordinates(pointTwoUncompressed);
  const slope = modulo(
    (pointOneY - pointTwoY) * modInv(pointOneX - pointTwoX, PRIME_MODULUS)
  );
  const sumPointX = modulo(slope ** 2n - pointOneX - pointTwoX);
  const sumPointY = modulo(slope * (pointOneX - sumPointX) - pointOneY);
  return pointAsBuffer(sumPointX, sumPointY, compressed);
};