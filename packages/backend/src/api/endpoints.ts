import express from "express";
import { generateInvoice } from "@/pdf/generation";
import { getPriceForBitcoinInCurrencyFiat as getPriceBitcoinForCurrencyFiat } from "@/pricing";
import { validationErrorMiddleware } from "@/api/middleware";
import { validatorsInvoiceGenerate } from "@/api/validation";

const app = express();

export const setupEndpoints = () => {
  app.use(express.json());

  app.get("/price-btc/:currency", ({ params: { currency } }, res, next) => {
    getPriceBitcoinForCurrencyFiat(currency)
      .then((priceBitcoin) => res.send({ priceBitcoin, currency }))
      .catch(next);
  });

  app.post(
    "/invoice/generate",
    ...validatorsInvoiceGenerate,
    async ({ body }, res, next) => {
      try {
        const invoiceSaveLocation = await generateInvoice(body);
        res.send({ invoiceSaveLocation });
      } catch (error) {
        next(error);
      }
    }
  );

  app.get("/invoice/:invoiceHash/pay", ({ params: { invoiceHash } }, res) => {
    // Retrieve invoice by hash
    // Generate BTC address
    res.send("Hello, world!");
  });

  app.use(validationErrorMiddleware);

  return {
    startExpressServer: (port = 3000) =>
      app.listen(port, () => {
        console.log(`App listening on port ${port}`);
      }),
  };
};
