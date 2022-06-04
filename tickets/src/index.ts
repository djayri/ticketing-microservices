import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY_DEPL must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
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
