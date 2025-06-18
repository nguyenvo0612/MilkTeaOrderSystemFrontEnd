import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Drink } from '../models/drink.interface';
import { CartItem } from '../models/cart-item.interface';
@Injectable({
  providedIn: 'root'
})
export class DrinkService {
  private apiUrl = 'http://localhost:8080/drinks';

  constructor(private http: HttpClient) { }

  getAvailableDrinksWithCart(cartItems: CartItem[]): Observable<Drink[]> {
    const request = cartItems.map(item => ({
      drinkId: item.drink.drinkId,
      quantity: item.quantity
    }));
    return this.http.post<Drink[]>(`${this.apiUrl}/available-with-cart`, request);
  }

  checkDrinkAvailabilityWithCart(drinkId: number, cartItems: CartItem[]): Observable<{ available: boolean; message: string }> {
    const request = cartItems.map(item => ({
      drinkId: item.drink.drinkId,
      quantity: item.quantity
    }));
    return this.http.post<{ available: boolean; message: string }>(
      `${this.apiUrl}/check-availability-with-cart?drinkId=${drinkId}`,
      request
    );
  }
}