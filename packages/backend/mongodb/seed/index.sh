set -e

mongo <<EOF

use $MONGO_INITDB_DATABASE

db.customers.drop();
db.invoices.drop();
db.payees.drop();
db.translations.drop();

db.createUser({
  user: '$MONGO_INITDB_DATABASE_ADMIN_USERNAME',
  pwd: '$MONGO_INITDB_DATABASE_ADMIN_PASSWORD',
  roles: ["readWrite"],
});


db.customers.createIndex({ nameShort: 1 }, { unique: true });
db.customers.insertMany([
  {
    name: "Talented Norge AS",
    nameShort: "talented",
    vat: "923930299MVA",
    address: {
      street: "Sandstuveien 2",
      postalCode: "1179",
      place: "place/oslo",
      country: "country/no",
    },
    projects: [
      {
        nameShort: "cognite",
        currency: "nok",
        priceHourly: $MONGO_INITDB_TALENTED_COGNITE_PRICE_HOURLY,
        descriptionWork:
          "Design and development of systems and services for Cognite's technical products and infrastructure\n" +
          "10240 ITverket: Robin Hellemans - Oreon IT Consulting BV\n" +
          "Please see Talented's timesheets for more info",
        paymentDetails: {
          name: "Oreon IT Consulting BV",
          iban: "LT29 3250 0446 5873 3587",
          swift: "REVOLT21",
          swiftIntermediary: "BARCDEFF",
          communication: "bank/doNotConvert",
        },
      },
      {
        nameShort: "defa",
        currency: "nok",
        priceHourly: $MONGO_INITDB_TALENTED_DEFA_PRICE_HOURLY,
        descriptionWork: "",
        paymentDetails: {
          name: "Oreon IT Consulting BV",
          iban: "LT29 3250 0446 5873 3587",
          swift: "REVOLT21",
          swiftIntermediary: "BARCDEFF",
          communication: "bank/doNotConvert",
        },
      },
    ],
  },
  {
    name: "Alpas IT Consulting BV",
    nameShort: "alpas",
    vat: "BE 0758.357.282",
    address: {
      street: "Mechelsesteenweg 56/6",
      postalCode: "2640",
      place: "place/mortsel",
      country: "country/be",
    },
    projects: [
      {
        nameShort: "defa",
        currency: "eur",
        cut: $MONGO_INITDB_ALPAS_DEFA_CUT,
        descriptionWork: "",
        paymentDetails: {
          name: "Oreon IT Consulting BV",
          iban: "BE91 7360 7649 5476",
          swift: "KREDBEBB",
        },
      },
    ],
  },
]);

db.invoices.createIndex({ number: 1 }, { unique: true });

db.payees.createIndex({ nameShort: 1 }, { unique: true });
db.payees.insertMany([
  {
    name: "Oreon IT Consulting BV",
    nameShort: "oreonIT",
    vat: "BE 0756.782.518",
    address: {
      street: "Salvialaan 28",
      postalCode: "2240",
      place: "place/zandhoven",
      country: "country/be",
    },
  },
]);

db.translations.createIndex({ namespace: 1 }, { unique: true });
db.translations.insertMany([
  {
    namespace: "textStatic",
    values: {
      title: {
        en: "INVOICE",
        nl: "FACTUUR",
      },
      invoiceNumber: {
        en: "Invoice number",
        nl: "Factuurnummer",
      },
      dateInvoice: {
        en: "Invoice date",
        nl: "Betalingsdatum",
      },
      dateDue: {
        en: "Due date",
        nl: "Betalingsdatum",
      },
      description: {
        en: "Description",
        nl: "Beschrijving",
      },
      hoursWorked: {
        en: "Hours worked",
        nl: "Uren gewerkt",
      },
      invoicedToEndCustomer: {
        en: "Invoiced price",
        nl: "Gefactureerde prijs",
      },
      cut: {
        en: "Cut",
        nl: "Deel",
      },
      hourlyRate: {
        en: "Hourly rate",
        nl: "Uurtarief",
      },
      subTotal: {
        en: "Sub Total",
        nl: "Subtotaal",
      },
      vat: {
        en: "VAT",
        nl: "BTW",
      },
      toPay: {
        en: "To pay",
        nl: "Te betalen",
      },
      communication: {
        en: "Communication",
        nl: "Communicatie",
      },
      iban: {
        en: "IBAN",
        nl: "IBAN",
      },
      swift: {
        en: "SWIFT",
        nl: "SWIFT",
      },
      swiftIntermediary: {
        en: "SWIFT intermediary",
        nl: "SWIFT tussenpartij",
      },
    },
  },
  {
    namespace: "country",
    values: {
      no: {
        en: "Norway",
        nl: "Noorwegen",
      },
      be: {
        en: "Belgium",
        nl: "België",
      },
    },
  },
  {
    namespace: "place",
    values: {
      lier: {
        en: "Lier",
        nl: "Lier",
      },
      mortsel: {
        en: "Mortsel",
        nl: "Mortsel",
      },
      oslo: {
        en: "Oslo",
        nl: "Oslo",
      },
      zandhoven: {
        en: "Zandhoven",
        nl: "Zandhoven",
      },
    },
  },
  {
    namespace: "paymentDetails",
    values: {
      doNotConvert: {
        en: "Do not convert to EUR",
        nl: "Niet naar EUR omzetten",
      },
    },
  },
]);
EOF
