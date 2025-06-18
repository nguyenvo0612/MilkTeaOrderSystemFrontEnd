import { Component, OnInit } from '@angular/core';
import { DrinkManagementService } from '../../services/drink-management.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Drink } from '../../models/drink.model';
import { DrinkRecipe } from '../../models/drink-recipe.model';
import { DrinkDTO } from '../../models/drink-dto.model';

@Component({
  selector: 'app-drink-management',
  templateUrl: './drink-management.component.html',
  styleUrls: ['./drink-management.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class DrinkManagementComponent implements OnInit {
  drinks: Drink[] = [];
  selectedDrink: Drink | null = null;
  drinkRecipes: DrinkRecipe[] = [];
  loading: boolean = false;
  error: string | null = null;
  
  // Search
  searchTerm: string = '';

  showAddDrinkModal: boolean = false;
  newDrink: DrinkDTO = {
    name: '',
    price: 0,
    description: '',
    imageUrl: ''
  };

  showEditDrinkModal: boolean = false;
  editingDrink: Drink | null = null;
  editDrinkDTO: DrinkDTO = {
    name: '',
    price: 0,
    description: '',
    imageUrl: ''
  };

  constructor(private drinkManagementService: DrinkManagementService) {}

  ngOnInit(): void {
    this.loadDrinks();
  }

  loadDrinks(): void {
    this.loading = true;
    this.drinkManagementService.getAllDrinks().subscribe({
      next: (drinks) => {
        this.drinks = drinks;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Không thể tải danh sách đồ uống';
        this.loading = false;
      }
    });
  }

  searchDrinks(): void {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.drinkManagementService.searchDrinks(this.searchTerm).subscribe({
        next: (drinks) => {
          this.drinks = drinks;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Không thể tìm kiếm đồ uống';
          this.loading = false;
        }
      });
    } else {
      this.loadDrinks();
    }
  }

  viewRecipe(drink: Drink): void {
    this.selectedDrink = drink;
    this.loading = true;
    this.drinkManagementService.getDrinkRecipe(drink.drinkId).subscribe({
      next: (recipes) => {
        this.drinkRecipes = recipes;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Không thể tải công thức';
        this.loading = false;
      }
    });
  }

  closeRecipe(): void {
    this.selectedDrink = null;
    this.drinkRecipes = [];
  }

  deleteDrink(drinkId: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa đồ uống này?')) {
      this.loading = true;
      this.drinkManagementService.deleteDrink(drinkId).subscribe({
        next: () => {
          this.loadDrinks();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Không thể xóa đồ uống';
          this.loading = false;
        }
      });
    }
  }

  openAddDrinkModal(): void {
    this.showAddDrinkModal = true;
  }

  closeAddDrinkModal(): void {
    this.showAddDrinkModal = false;
    this.newDrink = {
      name: '',
      price: 0,
      description: '',
      imageUrl: ''
    };
  }

  submitNewDrink(): void {
    this.loading = true;
    this.drinkManagementService.createDrink(this.newDrink).subscribe({
      next: (createdDrink) => {
        this.drinks.push(createdDrink);
        this.closeAddDrinkModal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Không thể thêm đồ uống mới';
        this.loading = false;
      }
    });
  }

  openEditDrinkModal(drink: Drink): void {
    this.editingDrink = drink;
    this.editDrinkDTO = {
      name: drink.name,
      price: drink.price,
      description: drink.description,
      imageUrl: drink.imageUrl
    };
    this.showEditDrinkModal = true;
  }

  closeEditDrinkModal(): void {
    this.showEditDrinkModal = false;
    this.editingDrink = null;
    this.editDrinkDTO = {
      name: '',
      price: 0,
      description: '',
      imageUrl: ''
    };
  }

  submitEditDrink(): void {
    if (!this.editingDrink) return;

    this.loading = true;
    this.drinkManagementService.updateDrink(this.editingDrink.drinkId, this.editDrinkDTO).subscribe({
      next: (updatedDrink) => {
        // Update the drink in the list
        const index = this.drinks.findIndex(d => d.drinkId === updatedDrink.drinkId);
        if (index !== -1) {
          this.drinks[index] = updatedDrink;
        }
        this.closeEditDrinkModal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Không thể cập nhật đồ uống';
        this.loading = false;
      }
    });
  }
} 