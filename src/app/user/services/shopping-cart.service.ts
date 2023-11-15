import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
   * Función para realizar una solicitud get para ver el carrito de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getShipmentInformation(url: string): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud patch para procesar la compra
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  processSale(url: string, body: any): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(url, body, { headers });
  }

  /**
   * Función para realizar una solicitud get para ver el historial de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getShoppingHistory(url: string, page?: number, pageSize?: number): Observable<any> {
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
   * Función para realizar una solicitud delete para eliminar el carrito de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  cancelCustomerSaleId(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;
    
    return this.http.delete<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud get para ver detalle de compra por id
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  shoppingHistoryId(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.get<any>(url, { headers });
  }
}