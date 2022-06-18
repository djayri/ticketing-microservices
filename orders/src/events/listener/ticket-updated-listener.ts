import {
  BaseListener,
  Subjects,
  TicketUpdatedEvent,
} from "@ticketing-ms-djay/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends BaseListener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName: string = "orders-service";
  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, price, title } = data;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new Error("no ticket found");
    }

    ticket.set({
      price,
      title,
    });
    await ticket.save();
    msg.ack();
  }
}
