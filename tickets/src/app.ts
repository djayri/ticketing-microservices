import express from "express";
import { json } from "body-parser";
import "express-async-errors";
import cookieSession from "cookie-session";
import {
  errorHandler,
  NotFoundError,
  currentUser,
} from "@ticketing-ms-djay/common";
import * as allRouter from "./routes";

const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

Object.entries(allRouter).forEach(([key, value]) => {
  app.use(value);
});

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
