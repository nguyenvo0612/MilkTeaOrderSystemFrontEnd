import { Ingredient } from "./ingredient.interface";

export interface PurchaseLog {
  purchaseLogId: number;
  quantity: number;
  purchaseDate: string;
  price: number;
  ingredient: Ingredient;
}

export interface CreatePurchaseLogDto {
  ingredientId: number;
  quantity: number;
  price: number;
}