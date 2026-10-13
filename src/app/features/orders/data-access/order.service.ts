import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../../../core/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/orders';

  fetchPastOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  cancelOrder(orderId: string): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${orderId}`, {
      status: 'cancelled'
    });
  }
}
