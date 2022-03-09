import path from "path";
import os from "os";
import jsPDF from "jspdf";
import { addDays } from "date-fns";
import { Language } from "@/types";
import {
  addImage,
  writeSectionCustomer,
  writeSectionDates,
  writeSectionInvoiceNumber,
  writeSectionPayee,
  writeSectionPaymentDetails,
  writeSectionPrice,
  writeSectionTitle,
  writeSectionWorkForProjectHourly,
  writeSectionWorkForProjectReferral,
} from "@/pdf/sections-pdf";
import { createjsPDFEnhanced } from "@/pdf/helpers/jspdf-enhanced";
import { getPayee } from "@/service/payees.service";
import {
  getProjectByNameShort,
  getCustomer,
} from "@/service/customers.service";
import { getTranslationsForNamespaceAndLanguage } from "@/service/translations.service";
import { getVatPercentage } from "@/utils/utils-pdf";
import { getOffsetsX, OffsetsX } from "./helpers/layout";
import { Customer, ProjectHourly, ProjectReferral } from "@/db/types-customers";
import { Payee } from "@/db/types-payees";
import {
  getNextInvoiceNumberForYear,
  insertInvoice,
} from "@/service/invoices.service";

interface PDFGenerationOptions {
  lang: Language;
  customerNameShort: string;
  projectNameShort: string;
  payeeNameShort: string;
  dateInvoice?: Date;
  dueInDays?: number;
  hoursWorked?: number;
  invoicedToEndCustomer?: number;
}

export const generateInvoice = async ({
  lang,
  customerNameShort,
  payeeNameShort,
  projectNameShort,
  dateInvoice = new Date(),
  dueInDays = 30,
  hoursWorked,
  invoicedToEndCustomer,
}: PDFGenerationOptions) => {
  const dateDue = addDays(dateInvoice, dueInDays);
  const customer = await getCustomer(customerNameShort, lang);
  const project = getProjectByNameShort(customer, projectNameShort);
  const payee = await getPayee(payeeNameShort, lang);
  const textStatic = await getTranslationsForNamespaceAndLanguage(
    "textStatic",
    lang
  );
  const invoiceNumber = await getNextInvoiceNumberForYear(dateInvoice);

  const docInvoice = createjsPDFEnhanced();
  const offsetsX = getOffsetsX(docInvoice);

  writeSections(docInvoice, {
    offsetsX,
    textStatic,
    customer,
    payee,
    project,
    invoiceNumber,
    dateInvoice,
    dateDue,
    hoursWorked,
    invoicedToEndCustomer,
  });

  const invoiceSaveLocation = path.resolve(
    os.tmpdir(),
    `invoice-${invoiceNumber}.pdf`
  );
  docInvoice.save(invoiceSaveLocation);
  await insertInvoice(invoiceNumber, dateInvoice);
  return invoiceSaveLocation;
};

interface WriteSectionOptions {
  offsetsX: OffsetsX;
  customer: Customer;
  payee: Payee;
  project: ProjectHourly | ProjectReferral;
  textStatic: Record<string, string>;
  hoursWorked?: number;
  invoicedToEndCustomer?: number;
}

interface WriteSectionOptionsProjectHourly extends WriteSectionOptions {
  project: ProjectHourly;
  hoursWorked: number;
}

interface WriteSectionOptionsProjectReferral extends WriteSectionOptions {
  project: ProjectReferral;
  invoicedToEndCustomer: number;
}

const writeSections = (
  docInvoice: jsPDF,
  {
    offsetsX,
    textStatic,
    customer,
    payee,
    project,
    invoiceNumber,
    dateInvoice,
    dateDue,
    hoursWorked,
    invoicedToEndCustomer,
  }: {
    offsetsX: OffsetsX;
    textStatic: Record<string, string>;
    customer: Customer;
    payee: Payee;
    project: ProjectHourly | ProjectReferral;
    invoiceNumber: string;
    dateInvoice: Date;
    dateDue: Date;
    hoursWorked?: number;
    invoicedToEndCustomer?: number;
  }
) => {
  writeSectionTitle(docInvoice, offsetsX, textStatic);
  writeSectionCustomer(docInvoice, offsetsX, customer);
  writeSectionInvoiceNumber(docInvoice, offsetsX, textStatic, invoiceNumber);
  writeSectionDates(docInvoice, offsetsX, textStatic, dateInvoice, dateDue);
  writeSectionPayee(docInvoice, offsetsX, payee);
  writeSectionPaymentDetails(
    docInvoice,
    offsetsX,
    project.paymentDetails,
    textStatic
  );
  addImage(docInvoice);
  writeSectionProject(docInvoice, {
    offsetsX,
    customer,
    payee,
    project,
    textStatic,
    hoursWorked,
    invoicedToEndCustomer,
  });
};

const writeSectionProject = (
  docInvoice: jsPDF,
  {
    offsetsX,
    customer,
    payee,
    project,
    textStatic,
    hoursWorked,
    invoicedToEndCustomer,
  }: WriteSectionOptions
) => {
  if ("priceHourly" in project) {
    if (!hoursWorked) {
      throw new Error(
        "'hoursWorked' needs to be provided for a project of the type 'ProjectHourly'"
      );
    }
    writeSectionProjectHourly(docInvoice, {
      offsetsX,
      customer,
      payee,
      project,
      textStatic,
      hoursWorked,
    });
    return;
  }
  if (!invoicedToEndCustomer) {
    throw new Error(
      "'invoicedToEndCustomer' needs to be provided for a project of the type 'ProjectReferral'"
    );
  }
  writeSectionProjectReferral(docInvoice, {
    offsetsX,
    customer,
    payee,
    project,
    textStatic,
    invoicedToEndCustomer,
  });
};

const writeSectionProjectHourly = (
  docInvoice: jsPDF,
  {
    offsetsX,
    customer,
    payee,
    project,
    textStatic,
    hoursWorked,
  }: WriteSectionOptionsProjectHourly
) => {
  writeSectionWorkForProjectHourly(
    docInvoice,
    offsetsX,
    project,
    textStatic,
    hoursWorked
  );
  const subTotal = hoursWorked * project.priceHourly;
  writeSectionPrice(
    docInvoice,
    offsetsX,
    project,
    textStatic,
    getVatPercentage(customer, payee),
    subTotal
  );
};

const writeSectionProjectReferral = (
  docInvoice: jsPDF,
  {
    offsetsX,
    customer,
    payee,
    project,
    textStatic,
    invoicedToEndCustomer,
  }: WriteSectionOptionsProjectReferral
) => {
  writeSectionWorkForProjectReferral(
    docInvoice,
    offsetsX,
    project,
    textStatic,
    invoicedToEndCustomer
  );
  const subTotal = invoicedToEndCustomer * (project.cut / 100);
  writeSectionPrice(
    docInvoice,
    offsetsX,
    project,
    textStatic,
    getVatPercentage(customer, payee),
    subTotal
  );
};
