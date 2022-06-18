import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket, TicketDoc } from "../../models/ticket";
const PATH = "/api/orders";
const insertTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 1,
    title: "ticket title",
  });
  await ticket.save();
  return ticket;
};

const insertOrder = async (ticket: TicketDoc, userId?: string) => {
  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + 15 * 60);
  const order = Order.build({
    ticket,
    userId: userId || "randomUserId",
    expiresAt,
    status: OrderStatus.Created,
  });
  await order.save();
  return order;
};

it("return all user orders", async () => {
  const userIdOne = "userId1";
  const ticketOne = await insertTicket();
  const orderOne = await insertOrder(ticketOne, userIdOne);

  const ticketTwo = await insertTicket();
  const orderTwo = await insertOrder(ticketTwo, userIdOne);

  const userIdTwo = "userId2";
  const ticketThree = await insertTicket();
  const orderThree = await insertOrder(ticketThree, userIdTwo);

  const ordersForUserOne = await request(app)
    .get(PATH)
    .set("Cookie", global.generateAuthCookie(userIdOne))
    .send({})
    .expect(200);

  expect(ordersForUserOne.body).toHaveLength(2);
  expect(ordersForUserOne.body[0].id).toEqual(orderOne.id);
  expect(ordersForUserOne.body[0].ticket.id).toEqual(ticketOne.id);
  expect(ordersForUserOne.body[1].id).toEqual(orderTwo.id);
  expect(ordersForUserOne.body[1].ticket.id).toEqual(ticketTwo.id);

  const ordersForUserTwo = await request(app)
    .get(PATH)
    .set("Cookie", global.generateAuthCookie(userIdTwo))
    .send({})
    .expect(200);

  expect(ordersForUserTwo.body).toHaveLength(1);
  expect(ordersForUserTwo.body[0].id).toEqual(orderThree.id);
  expect(ordersForUserTwo.body[0].ticket.id).toEqual(ticketThree.id);
});
