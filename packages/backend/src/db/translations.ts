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

  async getTranslationsForNamespace(namespace: string) {
    const translationsForNamespace = await this.collection.findOne({
      namespace,
    });
    if (translationsForNamespace) {
      return translationsForNamespace.values;
    }
    throw new Error(`The namespace "${namespace}" was not found!`);
  }

  async getTranslation(namespace: string, key: string) {
    const translationsForNamespace = await this.getTranslationsForNamespace(
      namespace
    );
    if (translationsForNamespace) {
      const translationsForKey = translationsForNamespace[key];
      if (translationsForKey) {
        return translationsForKey[this.#lang];
      }
      throw new Error(
        `The key "${key}" was not found in the translations for namespace ${namespace}`
      );
    }
  }
}
