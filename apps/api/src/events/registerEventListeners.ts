import { eventBus, EventNames } from "@exchange/shared-events";

export function registerEventListeners() {
  eventBus.subscribe(EventNames.ORDER_PLACED, (event) => {
    console.log("[EVENT] Order placed:", event);
  });

  eventBus.subscribe(EventNames.ORDER_MATCHED, (event) => {
    console.log("[EVENT] Trade executed:", event);
  });

  eventBus.subscribe(EventNames.ORDER_CANCELLED, (event) => {
    console.log("[EVENT] Order cancelled:", event);
  });
}
