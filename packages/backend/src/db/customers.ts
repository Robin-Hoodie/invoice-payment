import { Language } from "../types";
import { DBTranslations } from "./translations";
import { getCollection } from "./utils-db";

export interface DocumentCustomer {
  name: string;
  nameShort: string;
  address: {
    street: string;
    postalCode: string;
    city: string; // translation
    country: string; // translation
    vat: string;
  };
}

export const collectionNameCustomers = "customers";

export class DBCustomers {
  #dbTranslations: DBTranslations;

  constructor(lang: Language) {
    this.#dbTranslations = new DBTranslations(lang);
  }

  get collection() {
    return getCollection<DocumentCustomer>(collectionNameCustomers);
  }

  async getCustomer(nameShort: string) {
    const customer = await this.collection.findOne(
      { nameShort },
      {
        projection: {
          _id: 0,
          nameShort: 0,
        },
      }
    );
    if (!customer) {
      throw new Error(
        `The customer with short name "${nameShort}" was not found!`
      );
    }
    const city = await this.#dbTranslations.getTranslation(
      customer.address.city
    );
    const country = await this.#dbTranslations.getTranslation(
      customer.address.country
    );
    return {
      ...customer,
      address: {
        ...customer.address,
        city,
        country,
      },
    };
  }
}
