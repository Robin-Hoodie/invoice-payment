import { getLatestInvoiceForYear } from "@/db/invoices.db";

export const getNextInvoiceNumberForYear = async (year: number) => {
  const invoice = await getLatestInvoiceForYear(year);
  const yearPrefix = year.toString().slice(-2);
  if (invoice) {
    const invoiceNumberInYear = (invoice.number + 1)
      .toString()
      .padStart(3, "0");
    return `#${yearPrefix}${invoiceNumberInYear}`;
  }
  return `#${yearPrefix}001`;
};
