import { Address } from "@/types";

export interface DocumentPayee {
  name: string;
  nameShort: string;
  vat: string;
  address: Address;
}

export type Payee = Omit<DocumentPayee, "nameShort">;
