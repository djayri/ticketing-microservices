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
    const { id, price, title, version } = data;
    const ticket = await Ticket.findOne({ _id: id, version: version - 1 });
    if (!ticket) {
      console.log(
        `ticket not found for id:${id}, version:${version}, skip the update`
      );
      return;
    }

    ticket.set({ price, title });
    await ticket.save();
    msg.ack();
  }
}
