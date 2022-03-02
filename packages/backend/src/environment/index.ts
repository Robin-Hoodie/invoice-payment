import "dotenv/config";

export const isOnEnvTest = process.env.NODE_ENV === "test";
export const isOnEnvDev = process.env.NODE_ENV === "development";
export const isOnEnvProduction = process.env.NODE_ENV === "production";

const envVariableErrorMessage = (envVariable: string) =>
  `Env variable ${envVariable} should be set!`;

if (!isOnEnvTest && !process.env.MONGO_INITDB_DATABASE) {
  throw new Error(envVariableErrorMessage("MONGO_INITDB_DATABASE"));
}
if (!isOnEnvTest && !process.env.MONGO_INITDB_DATABASE_ADMIN_USERNAME) {
  throw new Error(
    envVariableErrorMessage("MONGO_INITDB_DATABASE_ADMIN_USERNAME")
  );
}
if (!isOnEnvTest && !process.env.MONGO_INITDB_DATABASE_ADMIN_PASSWORD) {
  throw new Error(
    envVariableErrorMessage("MONGO_INITDB_DATABASE_ADMIN_USERNAME")
  );
}
export const mongoDatabase = process.env.MONGO_INITDB_DATABASE;
export const mongoAdminUsername =
  process.env.MONGO_INITDB_DATABASE_ADMIN_USERNAME;
export const mongoAdminPassword =
  process.env.MONGO_INITDB_DATABASE_ADMIN_PASSWORD;
