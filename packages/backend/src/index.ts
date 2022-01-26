import express from "express";
import { getPriceForBitcoinInCurrencyFiat } from "./clients/coin-gecko";

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  const priceForBitcoinInNOK = await getPriceForBitcoinInCurrencyFiat("nok");
  res.send({ priceForBitcoinInNOK });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
