import { Drink } from "./drink.model";

export interface DrinkRecipe {
  drinkRecipeId: number;
  quantity: number;
  drink: Drink;
  ingredient: Ingredient;
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
} 