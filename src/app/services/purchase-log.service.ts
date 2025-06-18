import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseLog, CreatePurchaseLogDto } from '../models/purchase-log.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseLogService {
  private apiUrl = `http://localhost:8080/purchaselog`;

  constructor(private http: HttpClient) {}


  createPurchaseLog(purchaseLog: CreatePurchaseLogDto): Observable<PurchaseLog> {
    return this.http.post<PurchaseLog>(`${this.apiUrl}/create`, purchaseLog);
  }
} 