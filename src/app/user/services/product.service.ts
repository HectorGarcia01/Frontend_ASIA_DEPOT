import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  /**
   * Función para realizar una solicitud get para listar productos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getProducts(url: string) {
    return this.http.get(url);
  }

  /**
   * Función para realizar una solicitud get para obtener un producto por Id
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getProductId(url: string) {
    return this.http.get(url);
  }
}
