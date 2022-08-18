import {
  BaseListener,
  ExpirationCompleteEvent,
  OrderStatus,
  Subjects,
} from "@ticketing-ms-djay/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";
import { OrcderCancelledPublish } from "../publisher/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends BaseListener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(
    data: ExpirationCompleteEvent["data"],
    msg: Message
  ): Promise<void> {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("order not found");
    }
    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();
    await new OrcderCancelledPublish(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    msg.ack();
  }
}
