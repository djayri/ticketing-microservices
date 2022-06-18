import {
  BaseListener,
  Subjects,
  TicketCreatedEvent,
} from "@ticketing-ms-djay/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = "orders-service";
  async onMessage(
    data: TicketCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, price, title } = data;
    const ticket = Ticket.build({
      id,
      price,
      title,
    });
    await ticket.save();
    msg.ack();
  }
}
