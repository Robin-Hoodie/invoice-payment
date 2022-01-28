import { createHmac } from "crypto";
import { pointMultiply, pointAdd } from "tiny-secp256k1";
import { GENERATOR_POINT } from "./secp256k1-constants";
import { decodeExtendedKey } from "./extended-key";
import { pubKeyToLegacyAddress } from "./address";
import { isXPubDecoded } from ".";

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

  if (isXPubDecoded(decodedExtendedKey)) {
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

    return pubKeyToLegacyAddress(pubKey);
  }

  throw new Error(
    "Generation of addresses is only possible based on XPubs for now"
  );
};
