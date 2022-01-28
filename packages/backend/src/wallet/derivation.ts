import { createHmac } from "crypto";
import { pointMultiply, pointAdd } from "tiny-secp256k1";
import { GENERATOR_POINT } from "./secp256k1-constants";
import { decodeExtendedKey } from "./extended-key";
import { pubKeyToLegacyAddress } from "./address";

const maxIndexNormalChildKeys = 2 ** 31;

const getIndexAsBuffer = (index: number) => {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(index);
  return buffer;
};

const generatePubKeyAndChainCode = (
  pubKey: Uint8Array,
  chainCode: Uint8Array,
  index: Uint8Array
) => {
  // Churn inputs throught HMAC-SHA512
  const hmac = createHmac("sha512", chainCode);
  hmac.update(Buffer.concat([pubKey, index]));
  const digest = hmac.digest();

  // Split HMAC-SHA512 output
  const hmacOutputFirstHalf: Uint8Array = digest.slice(0, 32);
  const childChainCode = Buffer.from(digest.slice(32));

  // Calculate pub key
  const hmacOutputFirstHalfTimesGeneratorPoint = pointMultiply(
    GENERATOR_POINT,
    hmacOutputFirstHalf
  );

  if (!hmacOutputFirstHalfTimesGeneratorPoint) {
    throw new Error(
      "Child public key point is at point of infinity after multiplication with generator point. Try the next index"
    );
  }

  const childPubKey = pointAdd(
    hmacOutputFirstHalfTimesGeneratorPoint,
    pubKey,
    true
  );

  if (!childPubKey) {
    throw new Error(
      "Child public key is at point of infinity after adding parent public key to it . Try the next index"
    );
  }

  return {
    pubKey: childPubKey,
    chainCode: childChainCode,
  };
};

export const generateAddressFromExtendedPubKey = (
  extendedKey: string,
  index: number
) => {
  if (index >= maxIndexNormalChildKeys) {
    throw new Error(
      `Index ${index} must be smaller than allowed index ${maxIndexNormalChildKeys}`
    );
  }
  const decodedExtendedKey = decodeExtendedKey(extendedKey);

  const { key: pubKey, chainCode } = decodedExtendedKey;

  const { pubKey: pubKeyLevelFour, chainCode: chainCodeLevelFour } =
    generatePubKeyAndChainCode(pubKey, chainCode, getIndexAsBuffer(0));

  const indexAsBuffer = getIndexAsBuffer(index);

  const { pubKey: pubKeyReceival } = generatePubKeyAndChainCode(
    pubKeyLevelFour,
    chainCodeLevelFour,
    indexAsBuffer
  );

  return pubKeyToLegacyAddress(pubKeyReceival);
};
