import {
  BasePublisher,
  OrderCancelledEvent,
  Subjects,
} from "@ticketing-ms-djay/common";

export class OrcderCancelledPublish extends BasePublisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
