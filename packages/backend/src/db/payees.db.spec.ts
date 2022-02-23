import { Collection } from "mongodb";
import { collectionNamePayees, getPayee } from "@/db/payees.db";
import { DocumentPayee } from "@/db/types-payees";
import {
  connectionClose,
  connectionSetup,
  getCollection,
} from "@/db/connection";
import { payeeBitcoinNV } from "@test/mock-db-objects";

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

  it(`should retrieve the payee by 'nameShort' while dropping 
the properties 'nameShort' and '_id' from the result`, async () => {
    await collectionPayees.insertOne({
      ...payeeBitcoinNV,
      nameShort: "bitcoin",
    });
    expect(await getPayee("bitcoin")).toEqual(payeeBitcoinNV);
  });

  it("should throw if attempting to retrieve a non-existing payee", async () => {
    await collectionPayees.insertOne({
      ...payeeBitcoinNV,
      nameShort: "bitcoin",
    });
    await expect(getPayee("short-name-does-not-exist")).rejects.toThrow(
      "'nameShort' 'short-name-does-not-exist'"
    );
  });
});
