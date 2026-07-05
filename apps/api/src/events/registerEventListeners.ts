import {
  eventBus,
  EventNames,
} from "@exchange/shared-events";

export function registerEventListeners() {
  eventBus.on(
    EventNames.ORDER_PLACED,
    (event) => {
      console.log(
        "[EVENT] Order placed:",
        event
      );
    }
  );

  eventBus.on(
    EventNames.ORDER_MATCHED,
    (event) => {
      console.log(
        "[EVENT] Trade executed:",
        event
      );
    }
  );

  eventBus.on(
    EventNames.ORDER_CANCELLED,
    (event) => {
      console.log(
        "[EVENT] Order cancelled:",
        event
      );
    }
  );
}