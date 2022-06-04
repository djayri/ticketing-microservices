import express, { Request, Response } from "express";
import { NotFoundError } from "@ticketing-ms-djay/common";
import { Ticket } from "../models/ticket";
const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const existingTicket = await Ticket.findById(id);
  if (!existingTicket) {
    throw new NotFoundError();
  }
  res.status(200).send(existingTicket);
});

export { router as getTicketRouter };
