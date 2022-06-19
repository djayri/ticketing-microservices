import { TicketCreatedEvent } from "@ticketing-ms-djay/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, msg } = await setup();
  const eventData: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "afdf",
    price: 1,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  await listener.onMessage(eventData, msg);

  const ticket = await Ticket.findOne({
    id: eventData.id,
    version: eventData.version,
  });
  if (!ticket) {
    fail("ticket should exists");
  }
  expect(ticket.id).toEqual(eventData.id);
  expect(ticket.title).toEqual(eventData.title);
  expect(ticket.price).toEqual(eventData.price);
  expect(msg.ack).toHaveBeenCalledTimes(1);
});
