import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getProducts(url: string) {
    return this.http.get(url);
  }

  getProductId(url: string) {
    return this.http.get(url);
  }
}
