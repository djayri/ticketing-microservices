import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const data = {
    id: randomBytes(4).toString("hex"),
    title: "test title",
    price: 21,
    sss: 1,
    dd: 1,
  };

  await new TicketCreatedPublisher(stan).publish(data);
});
