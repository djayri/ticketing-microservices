import Queue from "bull";
import { natsWrapper } from "../nats-wrapper";
import { ExpirationCompletePublisher } from "../publishers/expiration-complete-publisher";

interface Payload {
  orderId: string;
}
console.log({ redisHosst: process.env.REDIS_HOST });
const orderExpirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

orderExpirationQueue.process(async (job, done) => {
  console.log(`publishj expiration complete for orderId:${job.data.orderId}`);
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
  done();
});

export { orderExpirationQueue };
