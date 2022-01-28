import { decode } from "bs58check";

interface ExtendedKeyDecoded {
  version: Buffer;
  depth: Buffer;
  parentKeyFingerPrint: Buffer;
  childIndex: Buffer;
  chainCode: Buffer;
  key: Buffer;
}

export const decodeExtendedKey = (extendedKey: string): ExtendedKeyDecoded => {
  const extendedKeyDecoded = decode(extendedKey);
  const version = Buffer.from(extendedKeyDecoded.slice(0, 4));
  const depth = Buffer.from(extendedKeyDecoded.slice(4, 5));
  const parentKeyFingerPrint = Buffer.from(extendedKeyDecoded.slice(5, 9));
  const childIndex = Buffer.from(extendedKeyDecoded.slice(9, 13));
  const chainCode = Buffer.from(extendedKeyDecoded.slice(13, 45));
  const key = Buffer.from(extendedKeyDecoded.slice(45));
  return {
    version,
    depth,
    parentKeyFingerPrint,
    childIndex,
    chainCode,
    key,
  };
};
