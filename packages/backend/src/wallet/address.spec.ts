import { legacyAccountBTC } from "../../test/helpers";
import { pubKeyToLegacyAddress } from "./address";

describe("Addressses", () => {
  describe("pubKeyToLegacyAddress", () => {
    it("should retrieve the correct legacy (P2PKH) address for a given public key", () => {
      const pubKey = Buffer.from(legacyAccountBTC.publicKeys[0], "hex");
      const address = legacyAccountBTC.addresses[0];
      expect(pubKeyToLegacyAddress(pubKey)).toBe(address);
    });
  });
});
