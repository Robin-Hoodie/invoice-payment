import { connectionSetup } from "@/db/connection";

export const setup = async () => {
  await connectionSetup();
};
