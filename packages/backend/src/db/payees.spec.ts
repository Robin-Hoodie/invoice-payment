import { Collection } from "mongodb";
import { collectionNamePayees, DBPayees, DocumentPayee } from "./payees";
import {
  collectionNameTranslations,
  DocumentTranslation,
} from "./translations";
import { connectionClose, connectionSetup, getCollection } from "./utils-db";

describe("Payees", () => {
  let collectionTranslations: Collection<DocumentTranslation>;
  let collectionPayees: Collection<DocumentPayee>;

  beforeAll(async () => {
    await connectionSetup();
    collectionTranslations = getCollection(collectionNameTranslations);
    collectionPayees = getCollection(collectionNamePayees);
  });

  beforeEach(async () => {
    await collectionTranslations.deleteMany({});
    await collectionPayees.deleteMany({});
  });

  afterAll(async () => {
    await connectionClose();
  });

  it("should retrieve the payee info by short name with the necessary values translated", async () => {
    const dbPayees = new DBPayees("en");
    await collectionTranslations.insertMany([
      {
        namespace: "place",
        values: {
          london: {
            en: "London",
            nl: "Londen",
          },
        },
      },
      {
        namespace: "country",
        values: {
          uk: {
            en: "United Kingdom",
            nl: "Verenigd Koninkrijk",
          },
        },
      },
    ]);
    await collectionPayees.insertOne({
      name: "Bitcoin NV",
      nameShort: "bitcoin",
      vat: "BTC 012.234.567",
      address: {
        place: "place/london",
        country: "country/uk",
        postalCode: "1000",
        street: "Winchester Road 666",
      },
    });
    expect(await dbPayees.getPayee("bitcoin")).toEqual({
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

  it("should throw if attempting to retrieve a non-existing payee", async () => {
    const dbPayees = new DBPayees("en");
    await collectionPayees.insertOne({
      name: "Bitcoin NV",
      nameShort: "bitcoin",
      vat: "BTC 012.234.567",
      address: {
        place: "place/london",
        country: "country/uk",
        postalCode: "1000",
        street: "Winchester Road 666",
      },
    });
    await expect(
      dbPayees.getPayee("short-name-does-not-exist")
    ).rejects.toThrow('short name "short-name-does-not-exist"');
  });
});
