import { createHmac } from "crypto";
import { pointMultiply, pointAdd } from "tiny-secp256k1";
import { GENERATOR_POINT } from "./secp256k1-math";
import { decodeExtendedKey } from "./extended-key";
import { pubKeyToLegacyAddress } from "./address";
import { isXPubDecoded, isZPubDecoded, ORDER, pubKeyToSegwitAddress } from ".";
import { bufferToBigInt } from "../utils";

const maxIndexNormalChildKeys = 2 ** 31;

const getIndexAsBuffer = (index: number) => {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(index);
  return buffer;
};

const generatePubKeyAndChainCode = (
  pubKey: Uint8Array,
  chainCode: Buffer,
  index: Buffer
) => {
  // Churn inputs throught HMAC-SHA512
  const hmac = createHmac("sha512", chainCode);
  hmac.update(Buffer.concat([pubKey, index]));
  const digest = hmac.digest();

  // Split HMAC-SHA512 output
  const hmacDigestFirstHalf = digest.slice(0, 32);
  const childChainCode = Buffer.from(digest.slice(32));

  if (bufferToBigInt(hmacDigestFirstHalf) > ORDER) {
    throw new Error(
      "First half of HMAC digest greater than the order of the curve. Try the next index"
    );
  }

  // Calculate pub key
  const childPubKeyIntermediate = pointMultiply(
    GENERATOR_POINT,
    hmacDigestFirstHalf
  );

  if (!childPubKeyIntermediate) {
    throw new Error(
      "Child public key point is at point of infinity after multiplication with generator point. Try the next index"
    );
  }

  const childPubKey = pointAdd(childPubKeyIntermediate, pubKey, true);

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

  const isXPubKey = isXPubDecoded(decodedExtendedKey);
  const isZPubKey = isZPubDecoded(decodedExtendedKey);

  if (isXPubKey || isZPubKey) {
    const { pubKey: pubKeyIntermediate, chainCode } =
      generatePubKeyAndChainCode(
        decodedExtendedKey.key,
        decodedExtendedKey.chainCode,
        getIndexAsBuffer(0) // Generate receival address based on BIP-44
      );

    const indexAsBuffer = getIndexAsBuffer(index);

    const { pubKey } = generatePubKeyAndChainCode(
      pubKeyIntermediate,
      chainCode,
      indexAsBuffer
    );

    if (isXPubKey) {
      return pubKeyToLegacyAddress(pubKey);
    }
    return pubKeyToSegwitAddress(pubKey);
  }

  throw new Error(
    "Generation of addresses is only possible based on XPubs & ZPubs"
  );
};
