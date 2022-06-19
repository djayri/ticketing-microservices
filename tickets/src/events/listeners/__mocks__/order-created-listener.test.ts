import {
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
  TicketUpdatedEvent,
} from "@ticketing-ms-djay/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";

/**
 * create ticket, init OrderCreatedListener and mock NATS Message
 * @returns OrderCreatedListener, Nats Message, created Ticket
 */
const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    price: 1,
    title: "dfdfd",
    userId: "dfdfd",
  });

  await ticket.save();

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, msg, ticket };
};

it("updates ticket with orderId and publish ticket:updated event", async () => {
  const { listener, msg, ticket } = await setup();

  const eventData: OrderCreatedEvent["data"] = {
    expiresAt: JSON.stringify(new Date()),
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: "fdfdfd",
    version: 0,
    ticket: {
      id: ticket.id,
      price: 1,
    },
  };

  await listener.onMessage(eventData, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  if (!updatedTicket) {
    fail("ticket should exists");
  }
  expect(updatedTicket.orderId).toEqual(eventData.id);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);

  const publishedEvent = (natsWrapper.client.publish as jest.Mock).mock
    .calls[0][0];
  const publishedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(publishedEvent).toEqual(Subjects.TicketUpdated);
  expect(publishedData).toEqual({
    id: ticket.id,
    price: ticket.price,
    title: ticket.title,
    userId: ticket.userId,
    version: ticket.version + 1,
    orderId: eventData.id,
  } as TicketUpdatedEvent["data"]);

  expect(msg.ack).toHaveBeenCalledTimes(1);
});
