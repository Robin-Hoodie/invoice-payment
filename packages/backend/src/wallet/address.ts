import { hash160 } from "../utils";
import { encode } from "bs58check";

export const pubKeyToLegacyAddress = (pubKey: Uint8Array) => {
  const hash = hash160(pubKey);
  const addressPrefix = Buffer.alloc(1);
  return encode(Buffer.concat([addressPrefix, hash]));
};
