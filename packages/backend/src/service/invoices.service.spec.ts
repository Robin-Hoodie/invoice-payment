import { getLatestInvoiceForYear } from "@/db/invoices.db";
import { getNextInvoiceNumberForYear } from "@/service/invoices.service";

jest.mock("@/db/invoices.db");

const mockedGetLatestInvoice = jest.mocked(getLatestInvoiceForYear);

describe("Invoices Service", () => {
  it(`should return the next invoice number as '22002', when passed a date in the year 2022 
and the 'number' of the latest invoice for said year being '1'`, async () => {
    mockedGetLatestInvoice.mockResolvedValueOnce({
      number: 1,
      date: new Date(2022, 6, 6),
    });
    expect(await getNextInvoiceNumberForYear(new Date(2022, 6, 6))).toEqual(
      "#22002"
    );
  });

  it(`should return the next invoice number as '22001', when passed a date in the year 2022
and no invoices yet existing for the year '22002'`, async () => {
    mockedGetLatestInvoice.mockResolvedValueOnce(null);
    expect(await getNextInvoiceNumberForYear(new Date(2022, 6, 6))).toEqual(
      "#22001"
    );
  });
});
