import { generatePdf } from "./generation";
import { getTranslationsForNamespaceAndLanguage } from "@/service/translations.service";
import { getCustomer } from "@/service/customers.service";
import { getPayee } from "@/service/payees.service";
import {
  getNextInvoiceNumberForYear,
  insertInvoice,
} from "@/service/invoices.service";

jest.mock("@/service/translations.service");
jest.mock("@/service/customers.service", () => ({
  ...jest.requireActual("@/service/customers.service"),
  getCustomer: jest.fn(),
}));
jest.mock("@/service/payees.service");
jest.mock("@/service/invoices.service");

const mockedGetNextInvoiceNumberForYear = jest.mocked(
  getNextInvoiceNumberForYear
);
const mockedGetCustomer = jest.mocked(getCustomer);
const mockedGetTranslationsForNamespaceAndLanguage = jest.mocked(
  getTranslationsForNamespaceAndLanguage
);
const mockedGetPayee = jest.mocked(getPayee);
const mockedInsertInvoice = jest.mocked(insertInvoice);

describe("Generate", () => {
  it("should generate a PDF", async () => {
    mockedGetCustomer.mockResolvedValue({
      name: "Talented Norge AS",
      vat: "923930299MVA",
      address: {
        street: "Sandstuveien 2",
        postalCode: "1179",
        place: "Oslo",
        country: "Norway",
      },
      projects: [
        {
          nameShort: "cognite",
          currency: "nok",
          priceHourly: 1250,
          descriptionWork:
            "Design and development of systems and services for Cognite's technical products and infrastructure\n" +
            "10240 ITverket: Robin Hellemans - Oreon IT Consulting BV\n" +
            "Please see Talented's timesheets for more info",
          paymentDetails: {
            name: "Oreon IT Consulting BV",
            iban: "LT29 3250 0446 5873 3587",
            swift: "REVOLT21",
            swiftIntermediary: "BARCDEFF",
            communication: "Do not convert to EUR",
          },
        },
        {
          nameShort: "alpas",
          currency: "eur",
          cut: 5,
          descriptionWork: "Cut on referral to customer",
          paymentDetails: {
            name: "Oreon IT Consulting BV",
            iban: "BE24 9791 6282 7538",
            swift: "ARSPEBE22",
          },
        },
      ],
    });
    mockedGetPayee.mockResolvedValue({
      name: "Oreon IT Consulting BV",
      vat: "BE 0756.782.518",
      address: {
        street: "Salvialaan 28",
        postalCode: "2240",
        place: "Zandhoven",
        country: "Belgium",
      },
    });
    mockedGetTranslationsForNamespaceAndLanguage.mockResolvedValue({
      title: "INVOICE",
      iban: "IBAN",
      swift: "SWIFT",
      invoiceNumber: "Invoice Number",
      dateInvoice: "Invoice Date",
      dateDue: "Due Date",
      swiftIntermediary: "SWIFT Intermediary",
      communication: "Communication",
      description: "Description",
      hoursWorked: "Hours worked",
      hourlyRate: "Hourly rate",
      subTotal: "Sub Total",
      vat: "VAT",
      toPay: "To Pay",
      invoicedToEndCustomer: "Invoiced price",
      cut: "Deel",
    });
    mockedGetNextInvoiceNumberForYear
      .mockResolvedValueOnce("#20021")
      .mockResolvedValueOnce("#20022");
    await generatePdf({
      lang: "en",
      customerNameShort: "talented",
      payeeNameShort: "oreonIT",
      projectNameShort: "cognite",
      hoursWorked: 100,
    });
    await generatePdf({
      lang: "en",
      customerNameShort: "talented",
      payeeNameShort: "oreonIT",
      projectNameShort: "alpas",
      invoicedToEndCustomer: 1000,
    });
    expect(mockedInsertInvoice).toHaveBeenCalledTimes(2);
  });
});
