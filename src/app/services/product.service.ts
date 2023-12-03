import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../app.value';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];
  url = 'http://localhost:3000/data';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  deleteProduct(id: string): void {
    this.http.delete(`${this.url}/${id}`).subscribe();
  }

  updateProduct(id: string, body: Product): void {
    this.http.put(`${this.url}/${id}`, body).subscribe();
  }

  addProduct(body: Product): void {
    this.http.post(this.url, body).subscribe();
  }
}
