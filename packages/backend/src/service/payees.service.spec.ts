import { getPayee as getPayeeFromDB } from "@/db/payees.db";
import { getTranslation } from "@/service/translations.service";
import { getPayee } from "@/service/payees.service";
import { payeeBitcoinNV } from "@test/mock-db-objects";

jest.mock("@/service/translations.service");
jest.mock("@/db/payees.db");

const mockedGetTranslation = jest.mocked(getTranslation);
const mockedGetPayeeFromDB = jest.mocked(getPayeeFromDB);

describe("Payees Service", () => {
  it("should retrieve the payee with its city and country translated", async () => {
    mockedGetPayeeFromDB.mockResolvedValueOnce(payeeBitcoinNV);
    mockedGetTranslation.mockImplementation((translation) => {
      if (translation.includes("place")) {
        return Promise.resolve("London");
      }
      return Promise.resolve("United Kingdom");
    });
    expect(await getPayee("google", "en")).toEqual({
      ...payeeBitcoinNV,
      address: {
        ...payeeBitcoinNV.address,
        place: "London",
        country: "United Kingdom",
      },
    });
  });
});
