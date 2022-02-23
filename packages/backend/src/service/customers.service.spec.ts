import { getCustomer as getCustomerFromDB } from "@/db/customers.db";
import { getTranslation } from "@/service/translations.service";
import {
  getCustomer,
  getProjectByNameShort,
} from "@/service/customers.service";
import {
  customerGoogle,
  customerGoogleWithProject,
} from "@test/mock-db-objects";

jest.mock("@/service/translations.service");
jest.mock("@/db/customers.db");

const mockedGetTranslation = jest.mocked(getTranslation);
const mockedGetCustomerFromDB = jest.mocked(getCustomerFromDB);

describe("Customers Service", () => {
  it("should retrieve the customer with its city and country translated", async () => {
    mockedGetCustomerFromDB.mockResolvedValueOnce(customerGoogle);
    mockedGetTranslation.mockImplementation((translation) => {
      if (translation.includes("place")) {
        return Promise.resolve("Brussels");
      }
      return Promise.resolve("Belgium");
    });
    expect(await getCustomer("google", "en")).toEqual({
      ...customerGoogle,
      address: {
        ...customerGoogle.address,
        place: "Brussels",
        country: "Belgium",
      },
    });
  });

  it("should find the project by nameShort if the project is included in the customer's projects", () => {
    expect(
      getProjectByNameShort(customerGoogleWithProject, "projectA")
    ).toEqual({
      nameShort: "projectA",
      currency: "eur",
      priceHourly: 100,
      descriptionWork: "work work work",
      paymentDetails: {
        iban: "BE28 3948 2394 2356",
        swift: "ARSPBE22",
        name: "Argenta",
      },
    });
  });

  it("should throw an error if the nameShort passed does not match any of the customer's project nameShort properties", () => {
    expect(() =>
      getProjectByNameShort(customerGoogleWithProject, "projectB")
    ).toThrow('Project with nameShort "projectB"');
  });
});
