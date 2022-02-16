import { Language, Address } from "../types";
import { DBTranslations } from "./translations";
import { getCollection } from "./utils-db";

export interface DocumentPayee {
  name: string;
  nameShort: string;
  vat: string;
  address: Address;
}

export const collectionNamePayees = "payees";

export class DBPayees {
  #dbTranslations: DBTranslations;

  constructor(lang: Language) {
    this.#dbTranslations = new DBTranslations(lang);
  }

  get collection() {
    return getCollection<DocumentPayee>(collectionNamePayees);
  }

  async getPayee(nameShort: string) {
    const payee = await this.collection.findOne<
      Omit<DocumentPayee, "_id" | "nameShort">
    >(
      { nameShort },
      {
        projection: {
          _id: 0,
          nameShort: 0,
        },
      }
    );
    if (!payee) {
      throw new Error(
        `The payee with short name "${nameShort}" was not found!`
      );
    }
    const place = await this.#dbTranslations.getTranslation(
      payee.address.place
    );
    const country = await this.#dbTranslations.getTranslation(
      payee.address.country
    );
    return {
      ...payee,
      address: {
        ...payee.address,
        place,
        country,
      },
    };
  }
}
