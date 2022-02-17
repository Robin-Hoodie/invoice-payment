import { Collection } from "mongodb";
import {
  collectionNameTranslations,
  getTranslationsForNamespace,
} from "./translations.db";
import { DocumentTranslation } from "./types-translations";
import { connectionClose, connectionSetup, getCollection } from "./connection";

describe("Translations DB", () => {
  let collectionTranslations: Collection<DocumentTranslation>;

  beforeAll(async () => {
    await connectionSetup();
    collectionTranslations = getCollection(collectionNameTranslations);
  });

  beforeEach(async () => {
    await collectionTranslations.deleteMany({});
  });

  afterAll(async () => {
    await connectionClose();
  });

  it(`should retrieve the translations by nameSpace while dropping 
the property '_id' from the result`, async () => {
    await collectionTranslations.insertOne({
      namespace: "namespace",
      values: {
        foo: {
          en: "fooEn",
          nl: "fooNl",
        },
        bar: {
          en: "barEn",
          nl: "barEn",
        },
      },
    });
    expect(await getTranslationsForNamespace("namespace")).toEqual({
      namespace: "namespace",
      values: {
        foo: {
          en: "fooEn",
          nl: "fooNl",
        },
        bar: {
          en: "barEn",
          nl: "barEn",
        },
      },
    });
  });

  it("should throw if attempting to retrieve translations for a non-existing namespace", async () => {
    await collectionTranslations.insertOne({
      namespace: "namespace",
      values: {
        foo: {
          en: "fooEn",
          nl: "fooNl",
        },
      },
    });
    await expect(
      getTranslationsForNamespace("namespace-does-not-exist")
    ).rejects.toThrow('namespace "namespace-does-not-exist"');
  });
});
