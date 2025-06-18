import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrinkComponent } from '../../components/drink/drink.component';
import { DrinkService } from '../../services/drink.service';
import { OrderService } from '../../services/order.service';
import { Drink } from '../../models/drink.interface';
import { CartItem } from '../../models/cart-item.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, DrinkComponent]
})
export class HomeComponent implements OnInit {
  drinks: Drink[] = [];
  cartItems: CartItem[] = [];
  loading: boolean = true;
  error: string | null = null;
  totalAmount: number = 0;
  showError: boolean = false;
  errorMessage: string = '';

  constructor(
    private drinkService: DrinkService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDrinks();
  }

  loadDrinks(): void {
    this.loading = true;
    this.drinkService.getAvailableDrinksWithCart(this.cartItems).subscribe({
      next: (data) => {
        this.drinks = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Không thể tải danh sách đồ uống. Vui lòng thử lại sau.';
        this.loading = false;
        this.showErrorMessage('Không thể tải danh sách đồ uống. Vui lòng thử lại sau.');
        console.error('Lỗi khi tải danh sách đồ uống:', error);
      }
    });
  }

  addToCart(drink: Drink): void {
    const newCartItems = [...this.cartItems];
    const existingItemIndex = newCartItems.findIndex(item => item.drink.drinkId === drink.drinkId);
  
    let tempCartItems;
    if (existingItemIndex > -1) {
        tempCartItems = newCartItems.map((item, index) => {
            if (index === existingItemIndex) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
    } else {
        tempCartItems = [...newCartItems, {
            drink: {
              drinkId: drink.drinkId,
              name: drink.name,
              price: drink.price,
              imageUrl: drink.imageUrl
            },
            quantity: 1
        }];
    }

    this.drinkService.checkDrinkAvailabilityWithCart(drink.drinkId, tempCartItems).subscribe({
      next: (response) => {
        if (response.available) {
          this.cartItems = tempCartItems;
          this.updateTotalAmount();
          this.loadDrinks();
        } else {
          this.showErrorMessage(response.message);
        }
      },
      error: (error) => {
        console.error('Lỗi khi kiểm tra nguyên liệu:', error);
        this.showErrorMessage('Không thể kiểm tra nguyên liệu. Vui lòng thử lại sau.');
      }
    });
  }
  

  removeFromCart(drinkId: number): void {
    this.cartItems = this.cartItems.filter(item => item.drink.drinkId !== drinkId);
    this.updateTotalAmount();
    this.loadDrinks();
  }

  updateQuantity(drinkId: number, change: number): void {
    const itemIndex = this.cartItems.findIndex(item => item.drink.drinkId === drinkId);
    if (itemIndex > -1) {
      const item = this.cartItems[itemIndex];
      const newQuantity = item.quantity + change;

      if (newQuantity <= 0) {
        this.removeFromCart(drinkId);
        return;
      }

      if (change > 0) {
          const tempCartItems = this.cartItems.map((cartItem, index) => {
              if (index === itemIndex) {
                return { ...cartItem, quantity: newQuantity };
              }
              return cartItem;
          });

        this.drinkService.checkDrinkAvailabilityWithCart(drinkId, tempCartItems).subscribe({
          next: (response) => {
            if (response.available) {
              this.cartItems = tempCartItems;
              this.updateTotalAmount();
              this.loadDrinks();
            } else {
              this.showErrorMessage(response.message);
            }
          },
          error: (error) => {
            console.error('Lỗi khi kiểm tra nguyên liệu:', error);
            this.showErrorMessage('Không thể kiểm tra nguyên liệu. Vui lòng thử lại sau.');
          }
        });
      } else {
         const updatedCartItems = this.cartItems.map((cartItem, index) => {
              if (index === itemIndex) {
                return { ...cartItem, quantity: newQuantity };
              }
              return cartItem;
          });
         this.cartItems = updatedCartItems;
         this.updateTotalAmount();
         this.loadDrinks();
      }
    }
  }

  private updateTotalAmount(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + (item.drink.price * item.quantity);
    }, 0);
  }

  get hasItems(): boolean {
    return this.cartItems.length > 0;
  }

  showErrorMessage(message: string): void {
    this.errorMessage = message;
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
    }, 2000);
  }

  checkout(): void {
    if (!this.hasItems) {
      this.showErrorMessage('Giỏ hàng rỗng. Vui lòng thêm đồ uống để thanh toán.');
      return;
    }

    this.orderService.placeOrder(this.cartItems).subscribe({
      next: (response) => {
        console.log('Đặt hàng thành công:', response);
        const orderId = response.orderId;

        this.cartItems = [];
        this.updateTotalAmount();
        this.loadDrinks();
        this.showErrorMessage('Đặt hàng thành công!');

        this.router.navigate(['/orders', orderId]);
      },
      error: (error) => {
        console.error('Lỗi khi đặt hàng:', error);
        const errorMessage = error.error?.message || 'Không thể đặt hàng. Vui lòng thử lại sau.';
        this.showErrorMessage(errorMessage);
      }
    });
  }
}