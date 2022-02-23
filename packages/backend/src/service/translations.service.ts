import { Language } from "@/types";
import { getTranslationsForNamespace } from "@/db/translations.db";

export const getTranslationsForNamespaceAndLanguage = async (
  namespace: string,
  lang: Language
) => {
  const translationsForNamespace = await getTranslationsForNamespace(namespace);
  return Object.entries(translationsForNamespace.values).reduce<
    Record<string, string>
  >((translationsForLanguage, [translationKey, translationsForKey]) => {
    translationsForLanguage[translationKey] = translationsForKey[lang];
    return translationsForLanguage;
  }, {});
};

const getTranslationByNamespaceAndKey = async (
  namespace: string,
  key: string,
  lang: Language
) => {
  const translationsForNamespace = await getTranslationsForNamespaceAndLanguage(
    namespace,
    lang
  );
  const translationForKey = translationsForNamespace[key] as string | undefined;
  if (translationForKey) {
    return translationForKey;
  }
  throw new Error(
    `The key '${key}' was not found in the translations for 'namespace' '${namespace}'`
  );
};

export const getTranslation = (namespaceWithKey: string, lang: Language) => {
  const [namespace, key] = namespaceWithKey.split("/");
  return getTranslationByNamespaceAndKey(namespace, key, lang);
};
