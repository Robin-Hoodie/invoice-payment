import { getCustomer as getCustomerFromDB } from "@/db/customers.db";
import { getTranslation } from "@/service/translations.service";
import { getCustomer } from "@/service/customers.service";

jest.mock("@/service/translations.service");
jest.mock("@/db/customers.db");

const mockedGetTranslation = jest.mocked(getTranslation);
const mockedGetCustomerFromDB = jest.mocked(getCustomerFromDB);

describe("Customers Service", () => {
  it("should retrieve the customer with its city and country translated", async () => {
    mockedGetCustomerFromDB.mockResolvedValueOnce({
      name: "Google Belgium NV",
      vat: "BE 0878.065.378",
      address: {
        place: "place/brussels",
        country: "country/be",
        postalCode: "1040",
        street: "Amphitheatre Parkway 1600",
      },
      projects: [],
    });
    mockedGetTranslation.mockImplementation((translation) => {
      if (translation.includes("place")) {
        return Promise.resolve("Brussels");
      }
      return Promise.resolve("Belgium");
    });
    expect(await getCustomer("google", "en")).toEqual({
      name: "Google Belgium NV",
      vat: "BE 0878.065.378",
      address: {
        place: "Brussels",
        country: "Belgium",
        postalCode: "1040",
        street: "Amphitheatre Parkway 1600",
      },
      projects: [],
    });
  });
});
