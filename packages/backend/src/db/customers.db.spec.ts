import { Collection } from "mongodb";
import { collectionNameCustomers, getCustomer } from "@/db/customers.db";
import { DocumentCustomer } from "@/db/types-customers";
import {
  connectionClose,
  connectionSetup,
  getCollection,
} from "@/db/connection";
import { customerGoogle } from "@test/mock-db-objects";

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

  it(`should retrieve the customer info by 'nameShort' while dropping 
the properties 'nameShort' and '_id' from the result`, async () => {
    await collectionCustomers.insertOne({
      ...customerGoogle,
      nameShort: "google",
    });
    expect(await getCustomer("google")).toEqual(customerGoogle);
  });

  it("should throw if attempting to retrieve a non-existing customer", async () => {
    await collectionCustomers.insertOne({
      ...customerGoogle,
      nameShort: "google",
    });
    await expect(getCustomer("short-name-does-not-exist")).rejects.toThrow(
      "'nameShort' 'short-name-does-not-exist'"
    );
  });
});
