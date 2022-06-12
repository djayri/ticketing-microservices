import mongoose from "mongoose";

interface OrderAttrs {
  ticketId: string;
  status: number;
  userId: string;
  expiresAt: number;
}

// interface for order doc in mongodb
interface OrderDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// this is to inform typescript that we have build function in a model
// which accept OrderAttrs interface
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
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

orderSchema.statics.build = (data: OrderAttrs) => {
  return new Order(data);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
