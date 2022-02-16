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
      return Object.entries(translationsForNamespace.values).reduce<
        Record<string, string>
      >((translationsForLanguage, [translationKey, translationsForKey]) => {
        translationsForLanguage[translationKey] =
          translationsForKey[this.#lang];
        return translationsForLanguage;
      }, {});
    }
    throw new Error(`The namespace "${namespace}" was not found!`);
  }

  async getTranslation(namespace: string, key: string) {
    const translationsForNamespace = await this.getTranslationsForNamespace(
      namespace
    );
    const translationForKey = translationsForNamespace[key] as
      | string
      | undefined;
    if (translationForKey) {
      return translationForKey;
    }
    throw new Error(
      `The key "${key}" was not found in the translations for namespace ${namespace}`
    );
  }
}
