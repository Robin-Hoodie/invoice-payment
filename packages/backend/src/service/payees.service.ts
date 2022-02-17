import { getPayee as getPayeeFromDB } from "../db/payees.db";
import { Language } from "../types";
import { getTranslation } from "./translations.service";

export const getPayee = async (nameShort: string, lang: Language) => {
  const payee = await getPayeeFromDB(nameShort);
  const place = await getTranslation(payee.address.place, lang);
  const country = await getTranslation(payee.address.country, lang);
  return {
    ...payee,
    address: {
      ...payee.address,
      place,
      country,
    },
  };
};
