import { getCollection } from "@/db/connection";
import { DocumentInvoice } from "@/db/types-invoices";

export const collectionNameInvoices = "invoices";

export const getLatestInvoiceForYear = async (year: number) =>
  getCollection<DocumentInvoice>(
    collectionNameInvoices
  ).findOne<DocumentInvoice>(
    {
      date: {
        $gte: new Date(year, 0, 0),
        $lt: new Date(year + 1, 0, 0),
      },
    },
    {
      projection: {
        _id: 0,
      },
      sort: {
        number: -1,
      },
    }
  );

export const insertInvoice = async (invoice: DocumentInvoice) =>
  getCollection<DocumentInvoice>(collectionNameInvoices).insertOne(invoice);
