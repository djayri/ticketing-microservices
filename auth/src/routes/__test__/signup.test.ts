import request from "supertest";
import { app } from "../../app";

it("return 201 on successfully signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("return 400 with invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@.com",
      password: "password",
    })
    .expect(400);
});

it("return 400 with invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@.com",
      password: "s",
    })
    .expect(400);
});

it("return 400 with missing email or password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "password",
    })
    .expect(400);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
});

it("return 400 for duplicate email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("set a cookie on successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
