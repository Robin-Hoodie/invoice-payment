import { getCustomer as getCustomerFromDB } from "@/db/customers.db";
import { Customer } from "@/db/types-customers";
import { Language } from "@/types";
import { getTranslation } from "@/service/translations.service";

export const getCustomer = async (nameShort: string, lang: Language) => {
  const customer = await getCustomerFromDB(nameShort);
  const place = await getTranslation(customer.address.place, lang);
  const country = await getTranslation(customer.address.country, lang);
  return {
    ...customer,
    address: {
      ...customer.address,
      place,
      country,
    },
  };
};

export const getProjectByNameShort = (
  customer: Customer,
  nameShort: string
) => {
  const project = customer.projects.find(
    (project) => project.nameShort === nameShort
  );
  if (!project) {
    throw new Error(
      `Project with 'nameShort' '${nameShort}' is not a project for customer with 'name' '${customer.name}'`
    );
  }
  return project;
};
