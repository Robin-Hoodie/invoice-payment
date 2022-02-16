import { Collection } from "mongodb";
import {
  collectionNameTranslations,
  DBTranslations,
  DocumentTranslations,
} from "./translations";
import { connectionClose, connectionSetup, getCollection } from "./utils-db";

describe("Translations", () => {
  let collection: Collection<DocumentTranslations>;

  beforeAll(async () => {
    await connectionSetup();
    collection = getCollection<DocumentTranslations>(
      collectionNameTranslations
    );
  });

  beforeEach(async () => {
    await collection.deleteMany({});
  });

  afterAll(async () => {
    await connectionClose();
  });

  it("should retrieve all translations for a namespace", async () => {
    const dbTranslations = new DBTranslations("en");
    await collection.insertOne({
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
    expect(
      await dbTranslations.getTranslationsForNamespace("namespace")
    ).toEqual({
      foo: "fooEn",
      bar: "barEn",
    });
  });

  it("should throw if attempting to retrieve a translation in a non-existing namespace", async () => {
    const dbTranslations = new DBTranslations("en");
    await collection.insertOne({
      namespace: "namespace",
      values: {
        foo: {
          en: "fooEn",
          nl: "fooNl",
        },
      },
    });
    await expect(
      dbTranslations.getTranslationsForNamespace("namespace-does-not-exist")
    ).rejects.toThrow('namespace "namespace-does-not-exist"');
  });

  it("should retrieve a translation in English", async () => {
    const dbTranslations = new DBTranslations("en");
    await collection.insertOne({
      namespace: "namespace",
      values: {
        foo: {
          en: "fooEn",
          nl: "fooNl",
        },
      },
    });
    expect(await dbTranslations.getTranslation("namespace", "foo")).toBe(
      "fooEn"
    );
  });

  it("should throw if attempting to retrieve a translation for a non existing key", async () => {
    const dbTranslations = new DBTranslations("en");
    await collection.insertOne({
      namespace: "namespace",
      values: {
        foo: {
          en: "fooEn",
          nl: "fooNl",
        },
      },
    });
    await expect(
      dbTranslations.getTranslation("namespace", "key-does-not-exist")
    ).rejects.toThrow('key "key-does-not-exist"');
  });
});
