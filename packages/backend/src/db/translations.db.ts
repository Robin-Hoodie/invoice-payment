import { DocumentTranslation, Translation } from "@/db/types-translations";
import { getCollection } from "@/db/connection";

export const collectionNameTranslations = "translations";

export const getTranslationsForNamespace = async (namespace: string) => {
  const translationsForNamespace = await getCollection<DocumentTranslation>(
    collectionNameTranslations
  ).findOne<Translation>(
    {
      namespace,
    },
    {
      projection: {
        _id: 0,
      },
    }
  );
  if (!translationsForNamespace) {
    throw new Error(
      `Translations for the namespace "${namespace}" were not found!`
    );
  }
  return translationsForNamespace;
};
