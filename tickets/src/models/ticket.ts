import mongoose from "mongoose";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// interface for ticket doc in mongodb
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// this is to inform typescript that we have build function in a model
// which accept TicketAttrs interface
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.statics.build = (data: TicketAttrs) => {
  return new Ticket(data);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
