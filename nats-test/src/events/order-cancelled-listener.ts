import { Message } from "node-nats-streaming";
import {
  BaseListener,
  OrderCancelledEvent,
  Subjects,
} from "@ticketing-ms-djay/common";

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = "payments-service";

  onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    console.log("Event data", { data });
    msg.ack();
  }
}
