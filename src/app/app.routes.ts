import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { IngredientComponent } from './pages/ingredient/ingredient.component';
import { DrinkManagementComponent } from './pages/drink-management/drink-management.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'orders/:orderId', component: OrderDetailComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'ingredients', component: IngredientComponent },
  { path: 'manager-drink', component: DrinkManagementComponent },
  { path: '**', redirectTo: '' }
];
