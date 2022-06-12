import { Message } from "node-nats-streaming";
import { BaseListener } from "./base-listener";
import { Subjects } from "./subjets";
import { TicketUpdatedEvent } from "./ticket-updated-event";

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = "payments-service";

  onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    console.log("Event data", { data });
    msg.ack();
  }
}
