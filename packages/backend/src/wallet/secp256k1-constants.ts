// See https://learnmeabitcoin.com/technical/ecdsa
// Elliptic curve function: y^2 = x^3 + ax + b
// secp256k1 curve (a = 0, b = 7): y^2 = x^3 + 7

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
  55066263022277343669578718895168534326250603453777594175500187360389116729240n.toString(
    16
  ),
  "hex"
);
const GENERATOR_POINT_Y = Buffer.from(
  32670510020758816978083085130507043184471273380659243275938904335757337482424n.toString(
    16
  ),
  "hex"
);
const GENERATOR_POINT_PREFIX = Buffer.from("04", "hex");

export const GENERATOR_POINT = Buffer.concat([
  GENERATOR_POINT_PREFIX,
  GENERATOR_POINT_X,
  GENERATOR_POINT_Y,
]);
