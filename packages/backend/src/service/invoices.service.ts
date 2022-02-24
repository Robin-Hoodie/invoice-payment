import {
  getLatestInvoiceForYear,
  insertInvoice as insertInvoiceInDB,
} from "@/db/invoices.db";

export const getNextInvoiceNumberForYear = async (date: Date) => {
  const year = date.getFullYear();
  const yearPrefix = year.toString().slice(-2);
  const invoice = await getLatestInvoiceForYear(year);
  if (invoice) {
    const invoiceNumberInYear = (invoice.number + 1)
      .toString()
      .padStart(3, "0");
    return `#${yearPrefix}${invoiceNumberInYear}`;
  }
  return `#${yearPrefix}001`;
};

export const insertInvoice = async (invoiceNumber: string, date: Date) => {
  const number = Number(invoiceNumber.slice(3)); // Drop '#' and prefix for year
  return insertInvoiceInDB({
    number,
    date,
  });
};
