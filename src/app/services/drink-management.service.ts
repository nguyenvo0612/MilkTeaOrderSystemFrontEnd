import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Drink } from '../models/drink.model';
import { DrinkRecipe } from '../models/drink-recipe.model';
import { DrinkDTO } from '../models/drink-dto.model';

@Injectable({
  providedIn: 'root'
})
export class DrinkManagementService {
  private apiUrl = 'http://localhost:8080/drinks'; // Base URL for drink management
  private apiRecipeUrl = 'http://localhost:8080/drink-recipe';

  constructor(private http: HttpClient) {}

  // Get all drinks
  getAllDrinks(): Observable<Drink[]> {
    return this.http.get<Drink[]>(this.apiUrl);
  }

  // Get drink by ID
  getDrinkById(id: number): Observable<Drink> {
    return this.http.get<Drink>(`${this.apiUrl}/${id}`);
  }

  // Get drink recipe
  getDrinkRecipe(drinkId: number): Observable<DrinkRecipe[]> {
    return this.http.get<DrinkRecipe[]>(`${this.apiRecipeUrl}/${drinkId}/recipe`);
}

  // Create new drink
  createDrink(drinkDTO: DrinkDTO): Observable<Drink> {
    return this.http.post<Drink>(`${this.apiUrl}/create`, drinkDTO);
  }

  // Update existing drink
  updateDrink(id: number, drinkDTO: DrinkDTO): Observable<Drink> {
    return this.http.put<Drink>(`${this.apiUrl}/update/${id}`, drinkDTO);
  }

  // Delete drink
  deleteDrink(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Add ingredient to drink recipe
  addIngredientToRecipe(drinkId: number, recipe: DrinkRecipe): Observable<DrinkRecipe> {
    return this.http.post<DrinkRecipe>(`${this.apiUrl}/${drinkId}/recipe`, recipe);
  }

  // Update ingredient in drink recipe
  updateRecipeIngredient(drinkId: number, recipeId: number, recipe: DrinkRecipe): Observable<DrinkRecipe> {
    return this.http.put<DrinkRecipe>(`${this.apiUrl}/${drinkId}/recipe/${recipeId}`, recipe);
  }

  // Remove ingredient from drink recipe
  removeIngredientFromRecipe(drinkId: number, recipeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${drinkId}/recipe/${recipeId}`);
  }

  // Search drinks by name
  searchDrinks(name: string): Observable<Drink[]> {
    return this.http.get<Drink[]>(`${this.apiUrl}/search?name=${name}`);
  }

  // Get all ingredients for a drink
  getDrinkIngredients(drinkId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${drinkId}/ingredients`);
  }
} 