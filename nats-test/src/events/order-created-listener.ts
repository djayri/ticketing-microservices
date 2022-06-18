import { Message } from "node-nats-streaming";
import {
  BaseListener,
  OrderCreatedEvent,
  Subjects,
} from "@ticketing-ms-djay/common";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = "payments-service";

  onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    console.log("Event data", { data });
    msg.ack();
  }
}
