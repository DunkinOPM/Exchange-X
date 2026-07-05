import { redisSubscriber } from "@exchange/redis";
import { EventNames } from "@exchange/shared-events";

console.log("Listening for Redis events...");

redisSubscriber.subscribe(
  EventNames.ORDER_PLACED,
  (event) => {
    console.log("Type:", event.type);

    console.log(
      "Timestamp:",
      event.timestamp
    );

    console.log(
      "Payload:",
      event.payload
    );
  }
);