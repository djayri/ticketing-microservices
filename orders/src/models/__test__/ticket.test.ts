import mongoose from "mongoose";
import { Ticket } from "../ticket";

const insertTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "title",
    price: 1,
  });
  await ticket.save();
  return ticket;
};
it("OCC, throw error for invalid version", async () => {
  const ticket = await insertTicket();

  const ticketOne = await Ticket.findById(ticket.id);
  let ticketTwo = await Ticket.findById(ticket.id);

  if (!ticketOne || !ticketTwo) {
    throw new Error("ticket should exists");
  }
  ticketOne.set({
    title: "ticket one",
  });

  ticketTwo.set({
    title: "ticket two",
  });

  try {
    await ticketOne.save();
    await ticketTwo.save();
    fail("should throw error");
  } catch (err) {
    expect(err).toBeDefined();
  }

  // retry find ticket
  ticketTwo = await Ticket.findById(ticket.id);
  if (!ticketTwo) {
    throw new Error("ticket should exists");
  }
  ticketTwo.set({
    title: "ticket two",
  });
  await ticketTwo.save();
  expect(ticketTwo.title).toEqual("ticket two");
  expect(ticketTwo.version).toEqual(ticketOne.version + 1);
});
