import { Collection } from "mongodb";
import {
  collectionNameInvoices,
  getLatestInvoiceForYear,
  insertInvoice,
} from "@/db/invoices.db";
import { DocumentInvoice } from "@/db/types-invoices";
import {
  connectionClose,
  connectionSetup,
  getCollection,
} from "@/db/connection";

describe("Invoices DB", () => {
  let collectionInvoices: Collection<DocumentInvoice>;

  beforeAll(async () => {
    await connectionSetup();
    collectionInvoices = getCollection(collectionNameInvoices);
  });

  beforeEach(async () => {
    await collectionInvoices.deleteMany({});
  });

  afterAll(async () => {
    await connectionClose();
  });

  it(`should retrieve the invoice with 'number' set to '3' as the invoice with the highest 'number' for the year '2022', 
while also dropping '_id' from the result`, async () => {
    await collectionInvoices.insertMany([
      {
        number: 1,
        date: new Date(2022, 0, 1),
      },
      {
        number: 3,
        date: new Date(2022, 0, 2),
      },
      {
        number: 2,
        date: new Date(2022, 0, 3),
      },
      {
        number: 4,
        date: new Date(2021, 0, 3),
      },
    ]);
    expect(await getLatestInvoiceForYear(2022)).toEqual({
      number: 3,
      date: new Date(2022, 0, 2),
    });
  });

  it("should return null if there are no invoices for the year '2022'", async () => {
    await collectionInvoices.insertMany([
      {
        number: 1,
        date: new Date(2021, 0, 1),
      },
    ]);
    expect(await getLatestInvoiceForYear(2022)).toBeNull();
  });

  it("should insert the invoice", async () => {
    await insertInvoice({
      number: 200,
      date: new Date(),
    });
    const allInvoices = await collectionInvoices.find({}).toArray();
    expect(allInvoices).toEqual([expect.objectContaining({ number: 200 })]);
  });
});
