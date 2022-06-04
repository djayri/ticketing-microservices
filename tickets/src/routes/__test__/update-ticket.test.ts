import request from "supertest";
import { app } from "../../app";

const path = "/api/tickets";

// bad practice, because we use another route to test this route,
// should create ticket class with create function and use that function to create and simulate existing ticket
// don't prefer using Ticket.build, because it tightly coupled to mongo implementation
// only for learning purpose
const createTicket = ({
  title,
  price,
  userCookie,
}: {
  title: string;
  price: number;
  userCookie?: string[];
}) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", userCookie || global.generateAuthCookie())
    .send({ title, price })
    .expect(201);
};
it("return 401 if user is not logged-in", async () => {
  const response = await createTicket({ title: "ticket1", price: 1 });
  await request(app)
    .put(`${path}/${response.body.id}`)
    .send({ title: "newTitle", price: -1 })
    .expect(401);
});
it("return 400 if invalid price passed", async () => {
  const userCookie = global.generateAuthCookie();
  const response = await createTicket({
    title: "ticket1",
    price: 1,
    userCookie,
  });
  await request(app)
    .put(`${path}/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({ title: "newTitle", price: -1 })
    .expect(400);
});

it("return 400 if invalid title passed", async () => {
  const userCookie = global.generateAuthCookie();
  const response = await createTicket({
    title: "ticket1",
    price: 1,
    userCookie,
  });
  await request(app)
    .put(`${path}/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({ title: "", price: 1 })
    .expect(400);
});

it("return 404 if no ticket found", async () => {
  await request(app)
    .put(`${path}/non-exist-id`)
    .set("Cookie", global.generateAuthCookie())
    .send({ title: "newTitle", price: 2 })
    .expect(404);
});

it("return 403 if does not own the ticket", async () => {
  const response = await createTicket({ title: "ticket1", price: 1 });
  await request(app)
    .put(`${path}/${response.body.id}`)
    .set("Cookie", global.generateAuthCookie())
    .send({ title: "newTitle", price: 2 })
    .expect(403);
});

it("return 404 if user has a ticket but different id passed", async () => {
  const userCookie = global.generateAuthCookie();
  await createTicket({
    title: "ticket1",
    price: 1,
    userCookie,
  });

  const newTitle = "ticket2";
  const newPrice = 2;

  await request(app)
    .put(`${path}/non-exist-id`)
    .set("Cookie", userCookie)
    .send({ title: newTitle, price: newPrice })
    .expect(404);
});

it("return updated ticket if ticket updated successfully", async () => {
  const userCookie = global.generateAuthCookie();
  const response = await createTicket({
    title: "ticket1",
    price: 1,
    userCookie,
  });

  const newTitle = "ticket2";
  const newPrice = 2;

  await request(app)
    .put(`${path}/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200);

  const getResponse = await request(app)
    .get(`${path}/${response.body.id}`)
    .expect(200);

  expect(getResponse.body.title).toEqual(newTitle);
  expect(getResponse.body.price).toEqual(newPrice);
});
