export interface OrderBookUpdatedEvent {
  marketSymbol: string;

  snapshot: {
    bids: {
      price: number;
      quantity: number;
    }[];

    asks: {
      price: number;
      quantity: number;
    }[];
  };
}