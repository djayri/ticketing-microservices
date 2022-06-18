import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";

import { app } from "./app";
import { TicketCreatedListener } from "./events/listener/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listener/ticket-updated-listener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY_DEPL must be defined");
  }

  try {
    await connectToNats();
    await connectToMongo();
    await listenToEvents();
  } catch (err) {
    console.log({ err });
  }

  const port = 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}!!`);
  });
};

const connectToNats = async () => {
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }

  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
  );

  natsWrapper.client.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  process.on("SIGINT", () => {
    natsWrapper.client.close();
  });
  process.on("SIGTERM", () => {
    natsWrapper.client.close();
  });
};

const connectToMongo = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  await mongoose.connect(process.env.MONGO_URI);
  console.log("connected to mongodb");
};

const listenToEvents = async () => {
  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();
};

start();
