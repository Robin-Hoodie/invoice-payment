import { Language } from "../types";
import { getCollection } from "./utils-db";

export interface DocumentTranslations {
  namespace: string;
  values: Record<string, Record<Language, string>>;
}

export const collectionNameTranslations = "translations";

export class DBTranslations {
  #lang: Language;

  constructor(lang: Language) {
    this.#lang = lang;
  }

  get collection() {
    return getCollection<DocumentTranslations>(collectionNameTranslations);
  }

  async getTranslation(namespace: string, key: string) {
    const translationsForNamespace = await this.collection.findOne({
      namespace,
    });
    if (translationsForNamespace) {
      const translationsForKey = translationsForNamespace.values[key];
      if (translationsForKey) {
        return translationsForKey[this.#lang];
      }
      throw new Error(
        `The key "${key}" was not found in the translations for namespace ${namespace}`
      );
    }
    throw new Error(`The namespace "${namespace}" was not found!`);
  }
}
