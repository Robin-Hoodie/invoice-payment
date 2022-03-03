import { setup } from "@/setup";

setup()
  .then(({ startExpressServer }) => startExpressServer())
  .catch((e) => console.error("Something went wrong during setup: ", e));
