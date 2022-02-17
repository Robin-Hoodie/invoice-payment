import { Language } from "@/types";

export interface DocumentTranslation {
  namespace: string;
  values: Record<string, Record<Language, string>>;
}

export type Translation = DocumentTranslation;
