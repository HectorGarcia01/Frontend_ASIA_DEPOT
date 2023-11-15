import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Función para realizar una solicitud get para listar productos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getProducts(url: string, page?: number, pageSize?: number) {
    let params = new HttpParams();

    if (page && pageSize) {
      params = params.set('page', page.toString()).set('pageSize', pageSize.toString());
    }

    return this.http.get(url, { params });
  }

  /**
   * Función para realizar una solicitud get para ver las fotos de los productos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getProductPhoto(url: string, id: string): Observable<Blob> {
    url = `${url}/${id}`;

    return this.http.get(url, { responseType: 'blob' });
  }

  /**
   * Función para realizar una solicitud post para agregar un producto a favoritos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  addFavoriteProduct(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.post<any>(url, null, { headers });
  }

  /**
   * Función para realizar una solicitud get para listar productos favoritos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getFavoriteProducts(url: string, page?: number, pageSize?: number): Observable<any> {
    let params = new HttpParams();

    if (page && pageSize) {
      params = params.set('page', page.toString()).set('pageSize', pageSize.toString());
    }

    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(url, { params, headers });
  }

  /**
   * Función para realizar una solicitud delete para eliminar un producto de favoritos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  deleteFavoriteProduct(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.delete<any>(url, { headers });
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
