import express from "express";
import dotenv from "dotenv";
import { appRoute } from "./index";

const app = express();
dotenv.config();
const port = process.env.PORT || 4000;

app.use(appRoute);

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

export default app;
