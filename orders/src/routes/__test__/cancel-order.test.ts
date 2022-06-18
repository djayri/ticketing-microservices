import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

const PATH = "/api/orders";

const insertOrder = async (userId?: string) => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    id,
    price: 1,
    title: "ticket title",
  });
  await ticket.save();

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

it("cancel the order", async () => {
  const userIdOne = "user1";
  const order = await insertOrder(userIdOne);

  const orderResponse = await request(app)
    .put(`${PATH}/${order.id}`)
    .set("Cookie", global.generateAuthCookie(userIdOne))
    .send({})
    .expect(200);

  expect(orderResponse.body.id).toEqual(order.id);
  expect(orderResponse.body.status).toEqual(OrderStatus.Cancelled);
});

it("throw 401 if the order not owned by the requester", async () => {
  const userIdOne = "user1";
  const order = await insertOrder(userIdOne);

  const userIdTwo = "user2";
  const orderResponse = await request(app)
    .put(`${PATH}/${order.id}`)
    .set("Cookie", global.generateAuthCookie(userIdTwo))
    .send({})
    .expect(401);
});

it("throw 404 if order does not exists", async () => {
  const orderResponse = await request(app)
    .put(`${PATH}/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", global.generateAuthCookie())
    .send({})
    .expect(404);
});

it("emits order:cancelled event", async () => {
  const userIdOne = "user1";
  const order = await insertOrder(userIdOne);

  const orderResponse = await request(app)
    .put(`${PATH}/${order.id}`)
    .set("Cookie", global.generateAuthCookie(userIdOne))
    .send({})
    .expect(200);

  expect(orderResponse.body.id).toEqual(order.id);
  expect(orderResponse.body.status).toEqual(OrderStatus.Cancelled);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});
