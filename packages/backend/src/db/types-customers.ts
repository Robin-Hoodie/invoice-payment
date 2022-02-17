import { CurrencyFiat, Address } from "@/types";

interface ProjectGeneral {
  nameShort: string;
  currency: CurrencyFiat;
  descriptionWork: string;
  paymentDetails: {
    name: string;
    iban: string;
    swift: string;
    swiftIntermediary?: string;
    communication?: string;
  };
}

export interface ProjectHourly extends ProjectGeneral {
  priceHourly: number;
}

export interface ProjectReferral extends ProjectGeneral {
  cut: number;
}

export interface DocumentCustomer {
  name: string;
  nameShort: string;
  vat: string;
  address: Address;
  projects: (ProjectHourly | ProjectReferral)[];
}

export type Customer = Omit<DocumentCustomer, "nameShort">;
export type PaymentDetails = ProjectGeneral["paymentDetails"];
