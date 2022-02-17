import { getCollection } from "./connection";
import { DocumentPayee, Payee } from "./types-payees";

export const collectionNamePayees = "payees";

export const getPayee = async (nameShort: string) => {
  const payee = await getCollection<DocumentPayee>(
    collectionNamePayees
  ).findOne<Payee>(
    { nameShort },
    {
      projection: {
        _id: 0,
        nameShort: 0,
      },
    }
  );
  if (!payee) {
    throw new Error(`The payee with short name "${nameShort}" was not found!`);
  }
  return payee;
};
