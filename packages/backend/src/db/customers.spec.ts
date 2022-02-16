import { Collection } from "mongodb";
import {
  collectionNameCustomers,
  DBCustomers,
  DocumentCustomer,
} from "./customers";
import {
  collectionNameTranslations,
  DocumentTranslation,
} from "./translations";
import { connectionClose, connectionSetup, getCollection } from "./utils-db";

describe("Customers", () => {
  let collectionTranslations: Collection<DocumentTranslation>;
  let collectionCustomers: Collection<DocumentCustomer>;

  beforeAll(async () => {
    await connectionSetup();
    collectionTranslations = getCollection(collectionNameTranslations);
    collectionCustomers = getCollection(collectionNameCustomers);
  });

  beforeEach(async () => {
    await collectionTranslations.deleteMany({});
    await collectionCustomers.deleteMany({});
  });

  afterAll(async () => {
    await connectionClose();
  });

  it("should retrieve the customer info by short name with the necessary values translated", async () => {
    const dbCustomers = new DBCustomers("en");
    await collectionTranslations.insertMany([
      {
        namespace: "place",
        values: {
          brussels: {
            en: "Brussels",
            nl: "Brussel",
          },
        },
      },
      {
        namespace: "country",
        values: {
          be: {
            en: "Belgium",
            nl: "België",
          },
        },
      },
    ]);
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
    expect(await dbCustomers.getCustomer("google")).toEqual({
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

  it("should throw if attempting to retrieve a non-existing customer", async () => {
    const dbCustomers = new DBCustomers("en");
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
    await expect(
      dbCustomers.getCustomer("short-name-does-not-exist")
    ).rejects.toThrow('short name "short-name-does-not-exist"');
  });
});
