import request from "supertest";
import { app } from "../../app";

it("return correct user based on cookie", async () => {
  const cookie = await global.generateAuthCookie();
  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(res.body.currentUser.email).toEqual("test@test.com");
});

it("return no user with no cookie", async () => {
  const cookie = await global.generateAuthCookie();
  const res = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(res.body.currentUser).toEqual(null);
});
