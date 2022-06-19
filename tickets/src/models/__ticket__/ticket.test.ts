import mongoose from "mongoose";
import { Ticket } from "../ticket";

const insertTicket = async () => {
  const ticket = Ticket.build({
    title: "title",
    price: 1,
    userId: "randomUserId",
  });
  await ticket.save();
  return ticket;
};
it("OCC, throw error for invalid version", async () => {
  const ticket = await insertTicket();

  const instanceone = await Ticket.findById(ticket.id);
  let instanceTwo = await Ticket.findById(ticket.id);

  if (!instanceone || !instanceTwo) {
    throw new Error("all instance should exists");
  }
  instanceone.set({
    title: "ticket updated",
  });

  instanceTwo.set({
    title: "ticket updated again",
  });

  try {
    await instanceone.save();
    await instanceTwo.save();
    fail("should throw error");
  } catch (err) {
    expect(err).toBeDefined();
  }

  // retry find ticket
  instanceTwo = await Ticket.findById(ticket.id);
  if (!instanceTwo) {
    throw new Error("ticket should exists");
  }
  instanceTwo.set({
    title: "ticket updated again",
  });
  await instanceTwo.save();
  expect(instanceTwo.title).toEqual("ticket updated again");
  expect(instanceTwo.version).toEqual(instanceone.version + 1);
});
