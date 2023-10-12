import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  /**
   * Función para realizar una solicitud get para listar categorías
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getCategories(url: string) {
    return this.http.get(url);
  }
}
