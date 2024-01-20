import express from "express";
import productRouter from "./apps/productRouter.js";
import cors from "cors";
import bodyParser from "body-parser";
import { client } from "./utils/db.js";

async function main() {
  const app = express();

  const port = 4000;

  try {
    await client.connect();
    console.log(`connected to db`);
  } catch {
    console.log(`error to connect db`);
  }
  
  app.use(cors());
  app.use(bodyParser.json());

  app.use("/products", productRouter);

  app.listen(port, () => {
    console.log(`This is port ${port}`);
  });
}

main();
