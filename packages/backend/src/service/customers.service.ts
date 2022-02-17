import { getCustomer as getCustomerFromDB } from "@/db/customers.db";
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
