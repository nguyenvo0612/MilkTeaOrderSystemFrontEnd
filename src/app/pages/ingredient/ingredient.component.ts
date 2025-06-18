import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseLogService } from '../../services/purchase-log.service';
import { Ingredient } from '../../models/ingredient.interface';
import { PurchaseLog, CreatePurchaseLogDto } from '../../models/purchase-log.interface';
import { IngredientService } from '../../services/ingredient.service';

@Component({
  selector: 'app-ingredient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ingredient.component.html',
  styleUrls: ['./ingredient.component.scss']
})
export class IngredientComponent implements OnInit {
  ingredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];
  purchaseLogs: PurchaseLog[] = [];
  loading = false;
  error: string | null = null;
  selectedIngredient: Ingredient | null = null;
  isEditing = false;
  searchTerm = '';
  formData: Ingredient = {
    ingredientId: 0,
    name: '',
    unit: '',
    stockQuantity: 0,
    status: true
  };
  importFormData: CreatePurchaseLogDto = {
    ingredientId: 0,
    quantity: 0,
    price: 0,
  };

  constructor(
    private ingredientService: IngredientService,
    private purchaseLogService: PurchaseLogService
  ) {}

  ngOnInit(): void {
    this.loadIngredients();
    this.loadPurchaseLogs();
  }

  filterIngredients(): void {
    if (!this.searchTerm.trim()) {
      this.filteredIngredients = this.ingredients;
      return;
    }
    
    const searchLower = this.searchTerm.toLowerCase();
    this.filteredIngredients = this.ingredients.filter(ingredient => 
      ingredient.name.toLowerCase().includes(searchLower) ||
      ingredient.unit.toLowerCase().includes(searchLower)
    );
  }

  loadIngredients(): void {
    this.loading = true;
    this.error = null;
    this.ingredientService.getAllIngredients().subscribe({
      next: (data: Ingredient[]) => {
        this.ingredients = data;
        this.filteredIngredients = data;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = 'Không thể tải danh sách nguyên liệu. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Error loading ingredients:', error);
      }
    });
  }

  loadPurchaseLogs(): void {
    this.ingredientService.getPurchaseLogs().subscribe({
      next: (data: PurchaseLog[]) => {
        this.purchaseLogs = data;
      },
      error: (error: Error) => {
        console.error('Error loading purchase logs:', error);
      }
    });
  }

  openAddForm(): void {
    this.isEditing = false;
    this.selectedIngredient = {
        ingredientId: 0,
        name: '',
        unit: '',
        stockQuantity: 0,
        status: true
    };
    this.resetForm();
  }

  openEditForm(ingredient: Ingredient): void {
    this.isEditing = true;
    this.selectedIngredient = ingredient;
    this.formData = { ...ingredient };
  }

  resetForm(): void {
    this.formData = {
      ingredientId: 0,
      name: '',
      unit: '',
      stockQuantity: 0,
      status: true
    };
  }

  saveIngredient(): void {
    if (this.isEditing && this.selectedIngredient) {
      // Only send name, unit and ingredientId when updating
      const updatedIngredient = {
        ingredientId: this.selectedIngredient.ingredientId,
        name: this.formData.name,
        unit: this.formData.unit
      };
      
      this.ingredientService.updateIngredient(this.selectedIngredient.ingredientId, updatedIngredient as Ingredient)
        .subscribe({
          next: () => {
            this.loadIngredients();
            this.closeForm();
          },
          error: (error: Error) => {
            console.error('Error updating ingredient:', error);
          }
        });
    } else {
      // Only send name and unit when creating new ingredient
      const newIngredient = {
        name: this.formData.name,
        unit: this.formData.unit
      };
      
      this.ingredientService.createIngredient(newIngredient as Ingredient)
        .subscribe({
          next: () => {
            this.loadIngredients();
            this.closeForm();
          },
          error: (error: Error) => {
            console.error('Error creating ingredient:', error);
          }
        });
    }
  }

  deleteIngredient(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa nguyên liệu này?')) {
      this.ingredientService.deleteIngredient(id)
        .subscribe({
          next: () => {
            this.loadIngredients();
          },
          error: (error: Error) => {
            this.error = 'Không thể xóa nguyên liệu. Vui lòng thử lại sau.';
            console.error('Error deleting ingredient:', error);
          }
        });
    }
  }

  closeForm(): void {
    this.selectedIngredient = null;
    this.isEditing = false;
    this.resetForm();
  }

  openImportForm(ingredient: Ingredient): void {
    this.importFormData = {
      ingredientId: ingredient.ingredientId,
      quantity: 0,
      price: 0,
    };
  }

  importIngredient(): void {
    if (this.importFormData.ingredientId === 0) return;

    // Tạo object chỉ chứa 3 trường cần thiết
    const purchaseLogDto = {
      ingredientId: this.importFormData.ingredientId,
      quantity: this.importFormData.quantity,
      price: this.importFormData.price
    };

    this.purchaseLogService.createPurchaseLog(purchaseLogDto)
      .subscribe({
        next: () => {
          this.loadIngredients();
          this.loadPurchaseLogs();
          this.importFormData = {
            ingredientId: 0,
            quantity: 0,
            price: 0,
          };
        },
        error: (error: Error) => {
          console.error('Lỗi khi nhập nguyên liệu:', error);
        }
      });
  }

  toggleStatus(ingredient: Ingredient): void {
    const updatedIngredient = { ...ingredient, status: !ingredient.status };
    this.ingredientService.updateIngredient(ingredient.ingredientId, updatedIngredient)
      .subscribe({
        next: () => {
          this.loadIngredients();
        },
        error: (error: Error) => {
          console.error('Error toggling ingredient status:', error);
        }
      });
  }
}