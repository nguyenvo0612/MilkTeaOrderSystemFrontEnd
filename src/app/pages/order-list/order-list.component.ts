import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading: boolean = true;
  error: string | null = null;
  selectedOrder: Order | null = null;

  constructor(
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Error loading orders:', error);
      }
    });
  }

  viewOrderDetail(orderId: number): void {
    this.orderService.getOrderDetails(orderId).subscribe({
      next: (order) => {
        this.selectedOrder = order;
      },
      error: (error) => {
        this.error = 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.';
        console.error('Error loading order detail:', error);
      }
    });
  }

  closeOrderDetail(): void {
    this.selectedOrder = null;
  }
} 