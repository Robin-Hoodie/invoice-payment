import express from "express";
import { getPriceForBitcoinInCurrencyFiat as getPriceBitcoinForCurrencyFiat } from "./pricing";

const app = express();
const port = 3000;

app.get("/price-btc/:currency", ({ params: { currency } }, res, next) => {
  getPriceBitcoinForCurrencyFiat(currency)
    .then((priceBitcoin) => res.send({ priceBitcoin, currency }))
    .catch(next);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
