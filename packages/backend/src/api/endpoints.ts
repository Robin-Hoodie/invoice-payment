import express from "express";
import { generatePdf } from "@/pdf/generation";
import { getPriceForBitcoinInCurrencyFiat as getPriceBitcoinForCurrencyFiat } from "@/pricing";

const app = express();
const port = 3000;

export const setupEndpoints = () => {
  app.use(express.json());

  app.get("/price-btc/:currency", ({ params: { currency } }, res, next) => {
    getPriceBitcoinForCurrencyFiat(currency)
      .then((priceBitcoin) => res.send({ priceBitcoin, currency }))
      .catch(next);
  });

  app.post("/invoice/generate", async ({ body }, res, next) => {
    try {
      const invoiceSaveLocation = await generatePdf(body);
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

  return {
    startExpressServer: () =>
      app.listen(port, () => {
        console.log(`App listening on port ${port}`);
      }),
  };
};
