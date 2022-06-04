import express, { Request, Response } from "express";
import { requireAuth, NotFoundError } from "@ticketing-ms-djay/common";
import { Ticket } from "../models/ticket";
const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  const existingTicket = await Ticket.find({});
  res.status(200).send(existingTicket);
});

export { router as getAllTicketRouter };
