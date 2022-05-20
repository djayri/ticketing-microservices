import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY_DEPL must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("connected to mongodb");
  } catch (err) {
    console.log({ err });
  }

  const port = 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}!!`);
  });
};

start();
