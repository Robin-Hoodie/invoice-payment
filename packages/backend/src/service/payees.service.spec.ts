import { getPayee as getPayeeFromDB } from "@/db/payees.db";
import { getTranslation } from "@/service/translations.service";
import { getPayee } from "@/service/payees.service";

jest.mock("@/service/translations.service");
jest.mock("@/db/payees.db");

const mockedGetTranslation = jest.mocked(getTranslation);
const mockedGetPayeeFromDB = jest.mocked(getPayeeFromDB);

describe("Payees Service", () => {
  it("should retrieve the payee with its city and country translated", async () => {
    mockedGetPayeeFromDB.mockResolvedValueOnce({
      name: "Bitcoin NV",
      vat: "BTC 012.234.567",
      address: {
        place: "place/london",
        country: "country/uk",
        postalCode: "1000",
        street: "Winchester Road 666",
      },
    });
    mockedGetTranslation.mockImplementation((translation) => {
      if (translation.includes("place")) {
        return Promise.resolve("London");
      }
      return Promise.resolve("United Kingdom");
    });
    expect(await getPayee("google", "en")).toEqual({
      name: "Bitcoin NV",
      vat: "BTC 012.234.567",
      address: {
        place: "London",
        country: "United Kingdom",
        postalCode: "1000",
        street: "Winchester Road 666",
      },
    });
  });
});
