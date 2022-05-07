import express from "express";
import { json } from "body-parser";
import { errorHandler } from "./middleware/error-handler";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { currentUserRouter } from "./routes/current-user";
import { NotFoundError } from "./errors/not-found-error";
import "express-async-errors";

const app = express();
app.use(json());

app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}!!!`);
});
