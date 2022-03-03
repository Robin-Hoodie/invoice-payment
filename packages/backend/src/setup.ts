import { connectionSetup } from "@/db/connection";
import { setupEndpoints } from "./api/endpoints";

export const setup = async () => {
  await connectionSetup();
  return setupEndpoints();
};
