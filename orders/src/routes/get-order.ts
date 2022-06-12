import express, { Request, Response } from "express";
import { NotFoundError, requireAuth } from "@ticketing-ms-djay/common";
import { Order } from "../models/order";
const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as getOrderRouter };
