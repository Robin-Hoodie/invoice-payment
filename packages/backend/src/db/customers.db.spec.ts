import { Collection } from "mongodb";
import { collectionNameCustomers, getCustomer } from "./customers.db";
import { DocumentCustomer } from "./types-customers";
import { connectionClose, connectionSetup, getCollection } from "./connection";

describe("Customers DB", () => {
  let collectionCustomers: Collection<DocumentCustomer>;

  beforeAll(async () => {
    await connectionSetup();
    collectionCustomers = getCollection(collectionNameCustomers);
  });

  beforeEach(async () => {
    await collectionCustomers.deleteMany({});
  });

  afterAll(async () => {
    await connectionClose();
  });

  it(`should retrieve the customer info by nameShort while dropping 
the properties 'nameShort' and '_id' from the result`, async () => {
    await collectionCustomers.insertOne({
      name: "Google Belgium NV",
      nameShort: "google",
      vat: "BE 0878.065.378",
      address: {
        place: "place/brussels",
        country: "country/be",
        postalCode: "1040",
        street: "Amphitheatre Parkway 1600",
      },
      projects: [],
    });
    expect(await getCustomer("google")).toEqual({
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
  });

  it("should throw if attempting to retrieve a non-existing customer", async () => {
    await collectionCustomers.insertOne({
      name: "Google Belgium NV",
      nameShort: "google",
      vat: "BE 0878.065.378",
      address: {
        place: "place/brussels",
        country: "country/be",
        postalCode: "1040",
        street: "Amphitheatre Parkway 1600",
      },
      projects: [],
    });
    await expect(getCustomer("short-name-does-not-exist")).rejects.toThrow(
      'short name "short-name-does-not-exist"'
    );
  });
});
