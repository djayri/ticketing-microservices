import {
  BasePublisher,
  Subjects,
  TicketCreatedEvent,
} from "@ticketing-ms-djay/common";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
