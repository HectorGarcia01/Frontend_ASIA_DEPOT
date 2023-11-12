import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerManagementService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  /**
   * Función para realizar una solicitud get para ver todos los clientes
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getCustomers(url: string): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud get para ver las fotos de los clientes
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
   * Función para realizar una solicitud get para ver un cliente por id
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getCustomerId(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.get<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud delete para eliminar un cliente por id
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  deleteCustomer(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.delete<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud patch para activar un cliente por id
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  activateCustomer(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.patch<any>(url, null, { headers });
  }
}
