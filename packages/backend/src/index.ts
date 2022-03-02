import express from "express";
import { generatePdf } from "@/pdf/generation";
import { getPriceForBitcoinInCurrencyFiat as getPriceBitcoinForCurrencyFiat } from "@/pricing";
import { setup } from "@/setup";

const app = express();
const port = 3000;

setup();

app.get("/price-btc/:currency", ({ params: { currency } }, res, next) => {
  getPriceBitcoinForCurrencyFiat(currency)
    .then((priceBitcoin) => res.send({ priceBitcoin, currency }))
    .catch(next);
});

app.post("/invoice/generate", async (_, res, next) => {
  try {
    const invoiceSaveLocation = await generatePdf({
      lang: "en",
      customerNameShort: "talented",
      payeeNameShort: "oreonIT",
      projectNameShort: "cognite",
      hoursWorked: 25,
    });
    res.send({ invoiceSaveLocation });
  } catch (error) {
    next(error);
  }
});

app.get("/invoice/:invoiceHash/pay", ({ params: { invoiceHash } }, res) => {
  // Retrieve invoice by hash
  // Generate BTC address
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
