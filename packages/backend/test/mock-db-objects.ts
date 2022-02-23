import { Customer } from "@/db/types-customers";
import { Payee } from "@/db/types-payees";

export const customerGoogle: Customer = {
  name: "Google Belgium NV",
  vat: "BE 0878.065.378",
  address: {
    place: "place/brussels",
    country: "country/be",
    postalCode: "1040",
    street: "Amphitheatre Parkway 1600",
  },
  projects: [],
};

export const customerGoogleWithProject: Customer = {
  ...customerGoogle,
  projects: [
    {
      nameShort: "projectA",
      currency: "eur",
      priceHourly: 100,
      descriptionWork: "work work work",
      paymentDetails: {
        iban: "BE28 3948 2394 2356",
        swift: "ARSPBE22",
        name: "Argenta",
      },
    },
  ],
};

export const payeeBitcoinNV: Payee = {
  name: "Bitcoin NV",
  vat: "BTC 012.234.567",
  address: {
    place: "place/london",
    country: "country/uk",
    postalCode: "1000",
    street: "Winchester Road 666",
  },
};
