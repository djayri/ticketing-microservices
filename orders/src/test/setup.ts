import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

jest.mock("../nats-wrapper.ts");

declare global {
  var generateAuthCookie: (userId?: string) => string[];
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "sdfdfd";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.generateAuthCookie = (userId?: string) => {
  const userJWT = jwt.sign(
    {
      id: userId || new mongoose.Types.ObjectId().toHexString(),
      email: "email@test.com",
    },
    process.env.JWT_KEY!
  );

  const sessionJSON = JSON.stringify({ jwt: userJWT });
  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};
