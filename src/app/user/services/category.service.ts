import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../interfaces/category.interface';

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

  getCategories(url: string, page?: number, pageSize?: number): Observable<CategoryResponse> {
    let params = new HttpParams();

    if (page && pageSize) {
      params = params.set('page', page.toString()).set('pageSize', pageSize.toString());
    }

    return this.http.get<CategoryResponse>(url, { params });
  }
}
