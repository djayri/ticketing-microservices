import request from "supertest";
import { app } from "../../app";

const path = "/api/tickets";

// bad practice, because we use another route to test this route,
// should create ticket class with create function and use that function to create and simulate existing ticket
// don't prefer using Ticket.build, because it tightly coupled to mongo implementation
const createTicket = ({ title, price }: { title: string; price: number }) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.generateAuthCookie())
    .send({ title, price })
    .expect(201);
};

it("return empty ticket if no ticket found", async () => {
  const response = await request(app).get(`${path}`).send().expect(200);
  expect(response.body.length).toEqual(0);
});

it("return the list of tickets if exists", async () => {
  await createTicket({ title: "ticket 1", price: 1 });
  await createTicket({ title: "ticket 2", price: 2 });
  await createTicket({ title: "ticket 3", price: 3 });

  const response = await request(app).get(path).send().expect(200);
  expect(response.body.length).toEqual(3);
});
