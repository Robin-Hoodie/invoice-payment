import { Document, MongoClient } from "mongodb";
import {
  isOnEnvTest,
  mongoAdminPassword,
  mongoAdminUsername,
  mongoDatabase,
} from "@/environment";

let connection: MongoClient | null = null;

export const connectionSetup = async () => {
  const connectionString = isOnEnvTest
    ? global.__MONGO_URI__
    : `mongodb://${mongoAdminUsername}:${mongoAdminPassword}
@localhost:27017/${mongoDatabase}?maxPoolSize=20&w=majority`;
  if (connection) {
    console.warn(
      "Connection to MongoDB has already been initialized. Not initializing again.."
    );
    return;
  }
  connection = await MongoClient.connect(connectionString);
};

export const getCollection = <TSchema extends Document = Document>(
  collectionName: string
) => {
  const dbName = isOnEnvTest
    ? global.__MONGO_DB_NAME__
    : process.env.MONGO_DB_NAME;
  if (connection) {
    return connection.db(dbName).collection<TSchema>(collectionName);
  }
  throw new Error(
    "Connection to MongoDB has not been initialized! Did you forget to call 'connectionSetup'?"
  );
};

export const connectionClose = async () => {
  if (connection) {
    await connection.close();
    connection = null;
    return;
  }
  console.warn(
    "Connection to MongoDB has already been closed. Not closing again.."
  );
};
