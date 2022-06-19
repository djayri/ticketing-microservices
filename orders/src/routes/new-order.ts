import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@ticketing-ms-djay/common";
import { Order, OrderStatus } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublish } from "../events/publisher/order-created-publisher";

const ORDER_EXPIRATION_WINDOW_SECONDS = 15 * 60;
const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [body("ticketId").not().isEmpty().withMessage("TicketId must be provided")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (await ticket.isReserved()) {
      throw new BadRequestError("Ticket is already reserved");
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(
      expiresAt.getSeconds() + ORDER_EXPIRATION_WINDOW_SECONDS
    );

    const order = Order.build({
      ticket,
      expiresAt,
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
    });

    order.save();

    await new OrderCreatedPublish(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      status: order.status,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
