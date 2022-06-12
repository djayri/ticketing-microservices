import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  ForbiddenError,
  validateRequest,
} from "@ticketing-ms-djay/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const existingTicket = await Ticket.findById(req.params.id);
    if (!existingTicket) {
      throw new NotFoundError();
    }

    const { title, price, userId } = existingTicket;
    if (userId != req.currentUser?.id) {
      throw new ForbiddenError();
    }

    existingTicket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await existingTicket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: existingTicket.id,
      title: existingTicket.title,
      price: existingTicket.price,
      userId: existingTicket.userId,
    });

    res.status(200).send(existingTicket);
  }
);

export { router as updateTicketRouter };
