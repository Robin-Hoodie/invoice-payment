import { getTranslationsForNamespace } from "@/db/translations.db";
import {
  getTranslation,
  getTranslationsForNamespaceAndLanguage,
} from "@/service/translations.service";

jest.mock("@/db/translations.db");

const mockedGetTranslationsForNamespace = jest.mocked(
  getTranslationsForNamespace
);

describe("Translations Service", () => {
  it("should retrieve all translations in English for a given namespace", async () => {
    mockedGetTranslationsForNamespace.mockResolvedValueOnce({
      namespace: "namespace",
      values: {
        foo: {
          en: "fooEn",
          nl: "fooNl",
        },
        bar: {
          en: "barEn",
          nl: "barNl",
        },
      },
    });
    expect(
      await getTranslationsForNamespaceAndLanguage("namespace/foo", "en")
    ).toEqual({
      foo: "fooEn",
      bar: "barEn",
    });
  });

  it("should retrieve a translation in English by passing the namespace and key as a '/'delimited string", async () => {
    mockedGetTranslationsForNamespace.mockResolvedValueOnce({
      namespace: "namespace",
      values: {
        foo: {
          en: "fooEn",
          nl: "fooNl",
        },
      },
    });
    expect(await getTranslation("namespace/foo", "en")).toBe("fooEn");
  });

  it("should throw if attempting to retrieve a translation for a non existing key", async () => {
    mockedGetTranslationsForNamespace.mockResolvedValueOnce({
      namespace: "namespace",
      values: {
        foo: {
          en: "fooEn",
          nl: "fooNl",
        },
      },
    });
    await expect(
      getTranslation("namespace/key-does-not-exist", "en")
    ).rejects.toThrow('key "key-does-not-exist"');
  });
});
