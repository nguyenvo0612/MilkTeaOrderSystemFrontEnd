// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.interface';
import { Order } from '../models/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/orders'; // URL endpoint backend cho đơn hàng

  constructor(private http: HttpClient) { }

  placeOrder(cartItems: CartItem[]): Observable<Order> {
    const orderPayload = cartItems.map(item => ({
      drinkId: item.drink.drinkId,
      quantity: item.quantity
    }));

    return this.http.post<Order>(`${this.apiUrl}/place`, orderPayload);
  }

  getOrderDetails(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/all`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
}