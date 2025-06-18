// src/app/pages/order-detail/order-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute và Router
import { OrderService } from '../../services/order.service'; // Import OrderService
import { Order } from '../../models/order.interface'; // Import interface Order
import { catchError, finalize, tap } from 'rxjs/operators'; // Import các operators
import { of } from 'rxjs'; // Import of

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  standalone: true, // Nếu sử dụng Angular 14+ với standalone components
  imports: [CommonModule] // Import CommonModule nếu là standalone component
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute, // Để lấy tham số từ URL
    private orderService: OrderService, // Service để gọi API
    private router: Router // Để điều hướng (tùy chọn, có thể dùng cho nút quay lại)
  ) { }

  ngOnInit(): void {
    // Lấy 'orderId' từ URL route parameters
    const orderId = this.route.snapshot.paramMap.get('orderId');

    if (orderId) {
      const id = +orderId; // Chuyển đổi string thành number

      if (isNaN(id)) {
        this.error = 'ID đơn hàng không hợp lệ.';
        this.loading = false;
        console.error('ID đơn hàng không hợp lệ:', orderId);
        return;
      }

      // Gọi service để lấy chi tiết đơn hàng
      this.orderService.getOrderDetails(id).pipe(
        tap(order => {
          this.order = order;
          console.log('Chi tiết đơn hàng:', order);
        }),
        catchError(err => {
          console.error('Lỗi khi tải chi tiết đơn hàng:', err);
          this.error = 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.';
          // Có thể kiểm tra err.status để hiển thị lỗi cụ thể hơn (ví dụ: 404 Not Found)
          return of(null); // Trả về Observable of null để pipe không dừng lại
        }),
        finalize(() => {
          this.loading = false; // Dù thành công hay thất bại, dừng loading
        })
      ).subscribe();

    } else {
      this.error = 'Không có ID đơn hàng được cung cấp.';
      this.loading = false;
      console.error('Không có ID đơn hàng trong route.');
    }
  }

  // Hàm định dạng tiền tệ (tùy chọn, có thể dùng pipe currency)
  formatCurrency(amount: number | undefined): string {
      if (amount === undefined || amount === null) {
          return 'N/A';
      }
      // Sử dụng Intl.NumberFormat để định dạng tiền tệ Việt Nam
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  // Hàm định dạng ngày giờ (tùy chọn)
  formatDateTime(dateTimeString: string | undefined): string {
      if (!dateTimeString) return 'N/A';
       try {
            const date = new Date(dateTimeString);
             // Định dạng theo ý muốn, ví dụ: DD/MM/YYYY HH:mm
            return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
       } catch (e) {
            console.error("Không thể parse ngày giờ:", dateTimeString, e);
            return dateTimeString; // Trả về chuỗi gốc nếu không parse được
       }
  }


  // Hàm quay lại trang chủ (tùy chọn)
  goToHome(): void {
    this.router.navigate(['/']); // Điều hướng về route gốc (trang chủ)
  }
}