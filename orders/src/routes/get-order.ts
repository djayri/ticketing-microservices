import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from "@ticketing-ms-djay/common";
import { Order } from "../models/order";
const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("ticket");
    if (!order) {
      return new NotFoundError();
    }
    if (req.currentUser!.id !== order.userId) {
      throw new NotAuthorizedError();
    }
    res.status(200).send(order);
  }
);

export { router as getOrderRouter };
