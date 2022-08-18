import {
  BaseListener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@ticketing-ms-djay/common";
import { Message } from "node-nats-streaming";
import { orderExpirationQueue } from "../queues/order-expiration-queue";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(
      `waiting ${delay}ms / ${
        delay / 1000
      }s to proccess expiration job with orderId:${data.id}`
    );
    await orderExpirationQueue.add(
      { orderId: data.id },
      {
        delay,
      }
    );

    msg.ack();
  }
}
