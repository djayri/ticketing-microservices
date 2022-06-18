import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";
import { TicketUpdatedListener } from "./events/ticket-updated-listener";
import { OrderCreatedListener } from "./events/order-created-listener";
import { OrderCancelledListener } from "./events/order-cancelled-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
  new TicketUpdatedListener(stan).listen();
  new OrderCreatedListener(stan).listen();
  new OrderCancelledListener(stan).listen();
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
