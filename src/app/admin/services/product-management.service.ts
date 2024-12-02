import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  /**
   * Función para realizar una solicitud post para crear un producto
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  createProduct(url: string, product: any): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(url, product, { headers });
  }

  /**
   * Función para realizar una solicitud post para subir una imagen del producto
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  uploadProductPhoto(url: string, avatar: File): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('avatar', avatar);

    return this.http.post<any>(url, formData, { headers });
  }

  /**
   * Función para realizar una solicitud get para ver todos los productos
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getProducts(url: string, page?: number, pageSize?: number): Observable<any> {
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
   * Función para realizar una solicitud get para ver las fotos de los productos
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   */

  getPhotos(url: string, id: string): Observable<Blob> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.get(url, { headers, responseType: 'blob' });
  }

  /**
   * Función para realizar una solicitud get para ver un producto por id
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getProductId(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.get<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud patch para actualizar datos del producto
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  updateProduct(url: string, id: number, product: any): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;
    
    return this.http.patch<any>(url, product, { headers });
  }

  /**
   * Función para realizar una solicitud delete para eliminar un producto por id
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  deleteProduct(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.delete<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud delete para borrar la imagen del producto
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  deleteProductPhoto(url: string): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud patch para activar un producto por id
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  activateProduct(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.patch<any>(url, null, { headers });
  }
}
