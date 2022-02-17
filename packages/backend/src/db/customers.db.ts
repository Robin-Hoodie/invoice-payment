import { getCollection } from "@/db/connection";
import { DocumentCustomer, Customer } from "@/db/types-customers";

export const collectionNameCustomers = "customers";

export const getCustomer = async (nameShort: string) => {
  const customer = await getCollection<DocumentCustomer>(
    collectionNameCustomers
  ).findOne<Customer>(
    { nameShort },
    {
      projection: {
        _id: 0,
        nameShort: 0,
      },
    }
  );
  if (!customer) {
    throw new Error(
      `The customer with short name "${nameShort}" was not found!`
    );
  }
  return customer;
};
