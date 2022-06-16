import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket, TicketDoc } from "../../models/ticket";
import mongoose from "mongoose";

const PATH = "/api/orders";
const insertTicket = async () => {
  const ticket = Ticket.build({
    price: 1,
    title: "ticket title",
  });
  await ticket.save();
  return ticket;
};

const insertOrder = async (ticket: TicketDoc) => {
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + 15 * 60);
  const order = Order.build({
    ticket,
    userId: "userid",
    expiresAt,
    status: OrderStatus.Created,
  });
  await order.save();
  return order;
};

it("returns 404 error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post(PATH)
    .set("Cookie", global.generateAuthCookie())
    .send({ ticketId: ticketId })
    .expect(404);
});

it("returns 400 error if ticket is reserved", async () => {
  const ticket = await insertTicket();
  await insertOrder(ticket);
  await request(app)
    .post(PATH)
    .set("Cookie", global.generateAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("returns created order if order successfully created", async () => {
  const ticket = await insertTicket();
  // const order = await insertOrder(ticket);
  const createdOrder = await request(app)
    .post(PATH)
    .set("Cookie", global.generateAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(createdOrder.body.status).toEqual(OrderStatus.Created);
});

it.todo("emits order:created event");
