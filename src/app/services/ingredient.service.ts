import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingredient } from '../models/ingredient.interface';
import { PurchaseLog } from '../models/purchase-log.interface';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private apiUrl = 'http://localhost:8080/ingredients';

  constructor(private http: HttpClient) { }

  getAllIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.apiUrl);
  }

  getIngredientById(id: number): Observable<Ingredient> {
    return this.http.get<Ingredient>(`${this.apiUrl}/${id}`);
  }

  createIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(`${this.apiUrl}/create`, ingredient);
  }

  updateIngredient(id: number, ingredient: Ingredient): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.apiUrl}/${id}`, ingredient);
  }

  deleteIngredient(ingredientId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ingredientId}`);
  }

  getPurchaseLogs(): Observable<PurchaseLog[]> {
    return this.http.get<PurchaseLog[]>(`${this.apiUrl}/purchase-logs`);
  }

  importIngredient(importData: { ingredientId: number; quantity: number; price: number }): Observable<PurchaseLog> {
    return this.http.post<PurchaseLog>(`${this.apiUrl}/import`, importData);
  }
} 