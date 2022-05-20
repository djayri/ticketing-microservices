import request from "supertest";
import { app } from "../../app";

it("remove cookie on successful logout", async () => {
  const cookie = await global.generateAuthCookie();
  const res = await request(app)
    .post("/api/users/signout")
    .set("Cookie", cookie)
    .send({})
    .expect(201);

  expect(res.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
