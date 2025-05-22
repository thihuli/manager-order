
import { OrderStatus, OrderSide } from "../constants";

export interface Order {
  id: string;
  instrument: string;
  side: OrderSide;
  price: number;
  quantity: number;
  remainingQuantity: number;
  status: OrderStatus;
  timestamp: string;
}

export interface OrderHistory {
  timestamp: string;
  status: OrderStatus;
  description: string;
}

export interface OrderDetail extends Order {
  history: OrderHistory[];
}

export interface OrderFilters extends Partial<Order> {
  date?: string;
}

export interface OrderFormValues {
  instrument: string;
  side: OrderSide;
  price: number;
  quantity: number;
}
