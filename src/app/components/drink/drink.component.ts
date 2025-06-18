import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Drink } from '../../models/drink.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drink',
  templateUrl: './drink.component.html',
  styleUrls: ['./drink.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DrinkComponent {
  @Input() drink!: Drink;
  @Output() addToCart = new EventEmitter<Drink>();

  onAddToCart(): void {
    this.addToCart.emit(this.drink);
  }
} 