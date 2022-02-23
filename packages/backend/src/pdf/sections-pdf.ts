import jsPDF from "jspdf";
import path from "path";
import fs from "fs";
import { FontSize, TextColor } from "@/pdf/helpers/jspdf-enhanced";
import { formatPriceForCurrency } from "@/utils/utils-pdf";
import {
  Customer,
  ProjectHourly,
  PaymentDetails,
  ProjectReferral,
} from "@/db/types-customers";
import { Payee } from "@/db/types-payees";
import { formatDayMonthYear } from "@/utils/utils-date";
import { OffsetsX } from "@/pdf/helpers/layout";

export const writeSectionTitle = (
  doc: jsPDF,
  offsetsX: OffsetsX,
  textStatic: Record<string, string>
) => {
  doc.textEnhanced(textStatic.title, offsetsX.LEFT, 10, {
    fontStyle: "bold",
    fontSize: FontSize.LARGE,
    textColor: TextColor.BRAND_PRIMARY,
  });
};

export const writeSectionCustomer = (
  doc: jsPDF,
  offsetsX: OffsetsX,
  customer: Customer
) => {
  const postalCodeAndPlace = `${customer.address.postalCode} ${customer.address.place}`;
  doc
    .textEnhanced(customer.name, offsetsX.LEFT, 20)
    .textEnhanced(customer.address.street, offsetsX.LEFT, 25)
    .textEnhanced(postalCodeAndPlace, offsetsX.LEFT, 30)
    .textEnhanced(customer.address.country, offsetsX.LEFT, 35)
    .textEnhanced(customer.vat, offsetsX.LEFT, 40);
};

export const writeSectionInvoiceNumber = (
  doc: jsPDF,
  offsetsX: OffsetsX,
  textStatic: Record<string, string>,
  invoiceNumber: string
) => {
  doc
    .textEnhanced(textStatic.invoiceNumber, offsetsX.LEFT, 55)
    .textEnhanced(invoiceNumber, offsetsX.MIDDLE_LEFT, 55);
};

export const writeSectionDates = (
  doc: jsPDF,
  offsetsX: OffsetsX,
  textStatic: Record<string, string>,
  dateInvoice: Date,
  dateDue: Date
) => {
  doc
    .textEnhanced(textStatic.dateInvoice, offsetsX.LEFT, 60)
    .textEnhanced(formatDayMonthYear(dateInvoice), offsetsX.MIDDLE_LEFT, 60)
    .textEnhanced(textStatic.dateDue, offsetsX.LEFT, 65, {
      fontStyle: "bold",
      textColor: TextColor.BRAND_PRIMARY,
    })
    .textEnhanced(formatDayMonthYear(dateDue), offsetsX.MIDDLE_LEFT, 65, {
      fontStyle: "bold",
    });
};

export const writeSectionPayee = (
  doc: jsPDF,
  offsetsX: OffsetsX,
  payee: Payee
) => {
  const postalCodeAndPlace = `${payee.address.postalCode} ${payee.address.place}`;
  doc
    .textEnhanced(payee.name, offsetsX.RIGHT, 10, {
      fontStyle: "bold",
      textColor: TextColor.BRAND_PRIMARY,
    })
    .textEnhanced(payee.address.street, offsetsX.RIGHT, 15)
    .textEnhanced(postalCodeAndPlace, offsetsX.RIGHT, 20)
    .textEnhanced(payee.address.country, offsetsX.RIGHT, 25)
    .textEnhanced(payee.vat, offsetsX.RIGHT, 30);
};

export const writeSectionPaymentDetails = (
  doc: jsPDF,
  offsetsX: OffsetsX,
  paymentDetails: PaymentDetails,
  textStatic: Record<string, string>
) => {
  doc
    .textEnhanced(textStatic.iban, offsetsX.RIGHT - 2, 40, {
      align: "right",
    })
    .textEnhanced(paymentDetails.iban, offsetsX.RIGHT, 40)
    .textEnhanced(textStatic.swift, offsetsX.RIGHT - 2, 45, {
      align: "right",
    })
    .textEnhanced(paymentDetails.swift, offsetsX.RIGHT, 45);
  let offsetY = 50;
  if (paymentDetails.swiftIntermediary) {
    doc
      .textEnhanced(textStatic.swiftIntermediary, offsetsX.RIGHT - 2, offsetY, {
        align: "right",
      })
      .textEnhanced(paymentDetails.swiftIntermediary, offsetsX.RIGHT, offsetY);
    offsetY = 55;
  }
  if (paymentDetails.communication) {
    doc
      .textEnhanced(textStatic.communication, offsetsX.RIGHT - 2, offsetY, {
        align: "right",
      })
      .textEnhanced(paymentDetails.communication, offsetsX.RIGHT, offsetY);
  }
};

export const addImage = (doc: jsPDF) => {
  const imageExtension = "png";
  const logoPath = path.resolve(__dirname, `./image/logo.${imageExtension}`);
  const imageFile = fs.readFileSync(logoPath, "base64");
  const { width, height } = doc.getBounds();
  const imageDimensionsOriginal = {
    width: 585,
    height: 427,
  };
  const imageDimensions = {
    width: imageDimensionsOriginal.width / 15,
    height: imageDimensionsOriginal.height / 15,
  };
  doc.addImage(
    imageFile,
    imageExtension.toUpperCase(),
    width - imageDimensions.width - 5,
    height - imageDimensions.height - 5,
    imageDimensions.width,
    imageDimensions.height
  );
};

export const writeSectionWorkForProjectHourly = (
  doc: jsPDF,
  offsetsX: OffsetsX,
  project: ProjectHourly,
  textStatic: Record<string, string>,
  hoursWorked: number
) => {
  const hourlyRate = `${formatPriceForCurrency(
    project.priceHourly,
    project.currency
  )}`;
  doc
    .textEnhanced(textStatic.description, offsetsX.LEFT, 80, {
      textColor: TextColor.BRAND_PRIMARY,
    })
    .textEnhanced(textStatic.hoursWorked, offsetsX.LEFT, 100, {
      textColor: TextColor.BRAND_PRIMARY,
    })
    .textEnhanced(textStatic.hourlyRate, offsetsX.LEFT, 110, {
      textColor: TextColor.BRAND_PRIMARY,
    })
    .textEnhanced(project.descriptionWork, offsetsX.MIDDLE_LEFT, 80, {
      maxWidth: offsetsX.RIGHT - offsetsX.MIDDLE_LEFT,
    })
    .textEnhanced(hoursWorked.toString(), offsetsX.MIDDLE_LEFT, 100)
    .textEnhanced(hourlyRate, offsetsX.MIDDLE_LEFT, 110);
};

export const writeSectionWorkForProjectReferral = (
  doc: jsPDF,
  offsetsX: OffsetsX,
  project: ProjectReferral,
  textStatic: Record<string, string>,
  invoicedToEndCustomer: number
) => {
  const cutText = `${project.cut}%`;
  doc
    .textEnhanced(textStatic.description, offsetsX.LEFT, 80, {
      textColor: TextColor.BRAND_PRIMARY,
    })
    .textEnhanced(textStatic.invoicedToEndCustomer, offsetsX.LEFT, 100, {
      textColor: TextColor.BRAND_PRIMARY,
    })
    .textEnhanced(textStatic.cut, offsetsX.LEFT, 110, {
      textColor: TextColor.BRAND_PRIMARY,
    })
    .textEnhanced(project.descriptionWork, offsetsX.MIDDLE_LEFT, 80, {
      maxWidth: offsetsX.RIGHT - offsetsX.MIDDLE_LEFT,
    })
    .textEnhanced(
      formatPriceForCurrency(invoicedToEndCustomer, project.currency),
      offsetsX.MIDDLE_LEFT,
      100
    )
    .textEnhanced(cutText, offsetsX.MIDDLE_LEFT, 110);
};

export const writeSectionPrice = (
  doc: jsPDF,
  offsetsX: OffsetsX,
  project: ProjectHourly | ProjectReferral,
  textStatic: Record<string, string>,
  vatPercentage: number,
  subTotal: number
) => {
  const vat = `${textStatic.vat} ${vatPercentage}%`;
  const subTotalText = `${formatPriceForCurrency(subTotal, project.currency)}`;
  const vatPrice = vatPercentage * subTotal;
  const vatPriceText = `${formatPriceForCurrency(vatPrice, project.currency)}`;
  const total = subTotal + vatPrice;
  const totalText = `${formatPriceForCurrency(total, project.currency)}`;
  doc
    .textEnhanced(textStatic.subTotal, offsetsX.LEFT, 120, {
      textColor: TextColor.BRAND_PRIMARY,
    })
    .textEnhanced(vat, offsetsX.LEFT, 130, {
      textColor: TextColor.BRAND_PRIMARY,
    })
    .textEnhanced(textStatic.toPay, offsetsX.LEFT, 140, {
      textColor: TextColor.BRAND_PRIMARY,
      fontStyle: "bold",
    })
    .textEnhanced(subTotalText, offsetsX.MIDDLE_LEFT, 120)
    .textEnhanced(vatPriceText, offsetsX.MIDDLE_LEFT, 130)
    .textEnhanced(totalText, offsetsX.MIDDLE_LEFT, 140, {
      fontStyle: "bold",
    });
};
