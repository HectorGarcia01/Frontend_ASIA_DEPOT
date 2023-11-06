import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Función para realizar una solicitud post para agregar/actualizar un producto al carrito
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  addProductCart(url: string, body: any): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(url, body, { headers });
  }

  /**
   * Función para realizar una solicitud get para ver el carrito de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getShoppingCart(url: string): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud patch para actualizar un producto del carrito
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  updateProductCart(url: string, body: any): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(url, body, { headers });
  }

  /**
   * Función para realizar una solicitud delete para eliminar un producto del carrito
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  deleteProductCart(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.delete<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud delete para eliminar el carrito de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  deleteShoppingCart(url: string): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud patch para procesar la compra
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  processSale(url: string): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(url, null, { headers });
  }
}