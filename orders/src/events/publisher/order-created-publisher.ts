import {
  BasePublisher,
  OrderCreatedEvent,
  Subjects,
} from "@ticketing-ms-djay/common";

export class OrderCreatedPublish extends BasePublisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
