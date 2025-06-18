// src/app/models/order.interface.ts

import { Drink } from './drink.interface';

export interface OrderItem {
  orderItemId: number;
  quantity: number;
  subtotal: number;
  drink: Drink;
}

export interface Order {
  orderId: number;
  orderTime: string;
  totalPrice: number;
  orderItems: OrderItem[];
}