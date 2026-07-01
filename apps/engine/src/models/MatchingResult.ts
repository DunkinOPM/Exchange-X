import { EngineOrder } from "./EngineOrder";
import { Trade } from "./Trade";

export interface MatchingResult {
  trades: Trade[];
  updatedOrders: EngineOrder[];
}