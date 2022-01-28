import { hash160 } from ".";

describe("Utils", () => {
  describe("hash160", () => {
    it("should retrieve the correct hash for a given public key", () => {
      const pubKey = Buffer.from(
        "034e017c6ad98c83241db7f9f0e0c8f552cd4ce60023ac10230136d3480a4d9e97",
        "hex"
      );
      expect(hash160(pubKey).toString("hex")).toBe(
        "9cbbf17cc7ba64c3cd56b9dddac33d7e6c86ab93"
      );
    });
  });
});
