import { CurrencyFiat, Language, Address } from "../types";
import { XOR } from "../types/utility-types";
import { DBTranslations } from "./translations";
import { getCollection } from "./utils-db";

type ProjectGeneral = {
  nameShort: string;
  currency: CurrencyFiat;
};

type Project = XOR<
  ProjectGeneral & { priceHourly: number },
  ProjectGeneral & { cut: number }
>;

export interface DocumentCustomer {
  name: string;
  nameShort: string;
  vat: string;
  address: Address;
  projects: Project[];
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
    const customer = await this.collection.findOne<
      Omit<DocumentCustomer, "_id" | "nameShort">
    >(
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
    const place = await this.#dbTranslations.getTranslation(
      customer.address.place
    );
    const country = await this.#dbTranslations.getTranslation(
      customer.address.country
    );
    return {
      ...customer,
      address: {
        ...customer.address,
        place,
        country,
      },
    };
  }
}
