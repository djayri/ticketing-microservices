import { TicketUpdatedEvent } from "@ticketing-ms-djay/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket, TicketAttrs, TicketDoc } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

/**
 * create new ticket as existing ticket and TicketUpdatedListener
 * @param existingTicket
 * @returns instance of TicketUpdatedListenere & NATS Message
 */
const setup = async (existingTicket: TicketAttrs) => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // insert ticket
  const ticket = Ticket.build(existingTicket);
  await ticket.save();

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, msg };
};

it("creates and saves a ticket", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const existingTicket: TicketAttrs = {
    id: ticketId,
    title: "old",
    price: 0,
  };

  const { listener, msg } = await setup(existingTicket);

  const eventData: TicketUpdatedEvent["data"] = {
    id: ticketId,
    title: "new",
    price: 1,
    userId: "sdsdfds",
    version: 1,
  };
  await listener.onMessage(eventData, msg);

  const ticket = await Ticket.findOne({
    id: ticketId,
    version: eventData.version,
  });

  if (!ticket) {
    fail("ticket should exists");
  }
  expect(ticket.id).toEqual(eventData.id);
  expect(ticket.title).toEqual(eventData.title);
  expect(msg.ack).toHaveBeenCalledTimes(1);
});

it("did not call acks on out of order version", async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();
  const existingTicket: TicketAttrs = {
    id: ticketId,
    title: "old",
    price: 0,
  };

  const { listener, msg } = await setup(existingTicket);

  const eventData: TicketUpdatedEvent["data"] = {
    id: ticketId,
    title: "new",
    price: 1,
    userId: "sdsdfds",
    // correct version is 1, this version 2 will be skipped
    version: 2,
  };
  await listener.onMessage(eventData, msg);

  const ticket = await Ticket.findById(ticketId);

  // expect the ticket data remain the same as existing one
  expect(ticket!.id).toEqual(existingTicket.id);
  expect(ticket!.title).toEqual(existingTicket.title);
  expect(ticket!.price).toEqual(existingTicket.price);

  expect(msg.ack).not.toHaveBeenCalled();
});
