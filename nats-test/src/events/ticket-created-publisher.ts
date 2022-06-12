import { Stan } from "node-nats-streaming";
import { BasePublisher } from "./base-publisher";
import { Subjects } from "./subjets";
import { TicketCreatedEvent } from "./ticket-created-event";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
