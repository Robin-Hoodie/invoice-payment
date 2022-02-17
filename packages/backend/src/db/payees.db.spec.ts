import { Collection } from "mongodb";
import { collectionNamePayees, getPayee } from "./payees.db";
import { DocumentPayee } from "./types-payees";
import { connectionClose, connectionSetup, getCollection } from "./connection";

describe("Payees DB", () => {
  let collectionPayees: Collection<DocumentPayee>;

  beforeAll(async () => {
    await connectionSetup();
    collectionPayees = getCollection(collectionNamePayees);
  });

  beforeEach(async () => {
    await collectionPayees.deleteMany({});
  });

  afterAll(async () => {
    await connectionClose();
  });

  it(`should retrieve the payee by nameShort while dropping 
the properties 'nameShort' and '_id' from the result`, async () => {
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
    expect(await getPayee("bitcoin")).toEqual({
      name: "Bitcoin NV",
      vat: "BTC 012.234.567",
      address: {
        place: "place/london",
        country: "country/uk",
        postalCode: "1000",
        street: "Winchester Road 666",
      },
    });
  });

  it("should throw if attempting to retrieve a non-existing payee", async () => {
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
    await expect(getPayee("short-name-does-not-exist")).rejects.toThrow(
      'short name "short-name-does-not-exist"'
    );
  });
});
