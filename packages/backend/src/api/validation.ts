import { RequestHandler } from "express";
import { body, validationResult, CustomValidator } from "express-validator";
import { Language } from "@/types";

const checkValidation: RequestHandler = (req, _, next) => {
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    return next();
  }
  next(validationErrors);
};

const languages: Language[] = ["en", "nl"];

const valueExists = (value: Parameters<CustomValidator>[0]) =>
  value !== null && value !== undefined;
const isPositiveNumber = (value: Parameters<CustomValidator>[0]) =>
  typeof value === "number" && value >= 0;
const isPositiveInteger: CustomValidator = (value) =>
  isPositiveNumber(value) && Number.isInteger(value);
const notBothHoursWorkedAndInvoicedToEndCustomer: CustomValidator = (
  _,
  { req }
) =>
  !(
    valueExists(req.body.hoursWorked) &&
    valueExists(req.body.invoicedToEndCustomer)
  );
const invoicedToEndCustomerDoesNotExist: CustomValidator = (_, { req }) =>
  !valueExists(req.body.invoicedToEndCustomer);
const hoursWorkedDoesNotExist: CustomValidator = (_, { req }) =>
  !valueExists(req.body.hoursWorked);

export const validatorsInvoiceGenerate: RequestHandler[] = [
  body(["customerNameShort", "projectNameShort", "payeeNameShort"])
    .notEmpty()
    .withMessage("Should not be empty"),
  body("lang")
    .isIn(languages)
    .withMessage(`Should be one of "${languages.join(", ")}"`),
  body("dueInDays")
    .if(valueExists)
    .custom(isPositiveInteger)
    .withMessage("Should be a positive integer"),
  body("dateInvoice")
    .toDate() // See https://github.com/validatorjs/validator.js/blob/master/src/lib/toDate.js
    .exists({ checkNull: true })
    .withMessage("Should be a valid date"),
  body("hoursWorked")
    .custom(notBothHoursWorkedAndInvoicedToEndCustomer)
    .withMessage(
      "'invoicedToEndCustomer' should not be passed if 'hoursWorked' is passed"
    )
    .if(invoicedToEndCustomerDoesNotExist)
    .custom(isPositiveInteger)
    .withMessage("Should be a positive integer"),
  body("invoicedToEndCustomer")
    .custom(notBothHoursWorkedAndInvoicedToEndCustomer)
    .withMessage(
      "'hoursWorked' should not be passed if 'invoicedToEndCustomer' is passed"
    )
    .if(hoursWorkedDoesNotExist)
    .custom(isPositiveNumber)
    .withMessage("Should be a positive number"),
  checkValidation,
];
