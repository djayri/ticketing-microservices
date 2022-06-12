import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

const path = "/api/tickets";

it("return 401 for non logged-in user", async () => {
  await request(app).post(path).send().expect(401);
});

it("return 400 for no input with logged-in user", async () => {
  await request(app)
    .post(path)
    .set("Cookie", global.generateAuthCookie())
    .send({})
    .expect(400);
});

it("return 400 for invalid title with logged-in user", async () => {
  await request(app)
    .post(path)
    .set("Cookie", global.generateAuthCookie())
    .send({ title: "", price: 2 })
    .expect(400);
});

it("return 400 for invalid price with logged-in user", async () => {
  await request(app)
    .post(path)
    .set("Cookie", global.generateAuthCookie())
    .send({ title: "title", price: 0 })
    .expect(400);

  await request(app)
    .post(path)
    .set("Cookie", global.generateAuthCookie())
    .send({ title: "title", price: -1 })
    .expect(400);
});

it("return 401 for valid input with non logged-in user", async () => {
  await request(app).post(path).send({ title: "title", price: 1 }).expect(401);
});

it("return 201 for valid input with logged-in user", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "title";
  const price = 3;
  await request(app)
    .post(path)
    .set("Cookie", global.generateAuthCookie())
    .send({ title, price })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});
