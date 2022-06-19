import {
  BaseListener,
  OrderCreatedEvent,
  Subjects,
} from "@ticketing-ms-djay/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends BaseListener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = "tickets-service";

  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      console.log(`no ticket found for ${this.subject} event`, { data });
      return;
    }
    ticket.set({
      orderId: data.id,
    });
    await ticket.save();

    const { id, price, title, userId, version, orderId } = ticket;
    await new TicketUpdatedPublisher(this.client).publish({
      id,
      price,
      title,
      userId,
      version,
      orderId,
    });

    msg.ack();
  }
}
