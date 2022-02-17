import express from "express";
import { getPriceForBitcoinInCurrencyFiat as getPriceBitcoinForCurrencyFiat } from "@/pricing";

const app = express();
const port = 3000;

app.get("/price-btc/:currency", ({ params: { currency } }, res, next) => {
  getPriceBitcoinForCurrencyFiat(currency)
    .then((priceBitcoin) => res.send({ priceBitcoin, currency }))
    .catch(next);
});

app.get("/invoice/:invoiceHash/pay", ({ params: { invoiceHash } }, res) => {
  // Retrieve invoice by hash
  // Generate BTC address
  console.log("invoiceHash", invoiceHash);

  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
