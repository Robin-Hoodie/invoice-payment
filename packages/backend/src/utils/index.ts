import { createHash } from "crypto";

export const hash160 = (data: Uint8Array) => {
  const innerHash = createHash("sha256").update(data).digest();
  return createHash("ripemd160").update(innerHash).digest();
};
