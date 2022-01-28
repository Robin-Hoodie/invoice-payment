import { legacyAccountBTC } from "../../test/helpers";
import { generateAddressFromExtendedPubKey } from "./derivation";

describe("Derivation", () => {
  describe("generateAddressFromXPub", () => {
    it("should derive the first address from the given xpub", () => {
      expect(
        generateAddressFromExtendedPubKey(legacyAccountBTC.extendedKey, 0)
      ).toBe(legacyAccountBTC.addresses[0]);
    });
  });
});
