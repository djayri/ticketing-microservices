import {
  Subjects,
  TicketUpdatedEvent,
  BasePublisher,
} from "@ticketing-ms-djay/common";

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
