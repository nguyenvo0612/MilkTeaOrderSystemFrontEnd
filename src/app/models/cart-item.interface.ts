
export interface CartItem {
  drink: {
    drinkId: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
} 