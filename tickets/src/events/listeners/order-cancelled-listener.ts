import {
  BaseListener,
  OrderCancelledEvent,
  Subjects,
} from "@ticketing-ms-djay/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends BaseListener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = "tickets-service";

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      console.log(`no ticket found for ${this.subject} event`, { data });
      return;
    }
    ticket.set({
      orderId: undefined,
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
