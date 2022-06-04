import request from "supertest";
import { app } from "../../app";

const path = "/api/tickets";

it("return 404 if no ticket found", async () => {
  await request(app).get(`${path}/non-exist-id`).send().expect(404);
});

it("return the ticket if exists", async () => {
  const title = "title";
  const price = 3;

  // bad practice, because we use another route to test this route,
  // should create ticket class with create function and use that function to create and simulate existing ticket
  // don't prefer using Ticket.build, because it tightly coupled to mongo implementation
  const createResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.generateAuthCookie())
    .send({ title, price })
    .expect(201);

  const getResponse = await request(app)
    .get(`${path}/${createResponse.body.id}`)
    .send()
    .expect(200);
  expect(getResponse.body.title).toEqual(title);
  expect(getResponse.body.price).toEqual(price);
});
