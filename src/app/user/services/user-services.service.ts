import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
) { }

  /**
   * Función para realizar una solicitud get para listar todas las direcciones
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  public getAddress(url: string) {
    return this.http.get(url); 
  }

  /**
   * Función para realizar una solicitud post para crear nuevo cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */
  
  addCustomer(url: string, customer: any): Observable<any> {
    return this.http.post<any>(url, customer);
  }

  /**
   * Función para realizar una solicitud get para ver el perfil del cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getCustomerProfile(url: string): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.get<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud patch para actualizar datos del cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  updateCustomer(url: string, customer: any): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.patch<any>(url, customer, { headers });
  }

  /**
   * Función para realizar una solicitud post para subir una foto de perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  uploadProfilePhoto(url: string, avatar: File): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('avatar', avatar);

    return this.http.post<any>(url, formData, { headers });
  }

  /**
   * Función para realizar una solicitud get para ver la foto de perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getProfilePhoto(url: string): Observable<Blob> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(url, { headers, responseType: 'blob' });
  }

  /**
   * Función para realizar una solicitud delete para borrar la foto de perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  deleteProfilePhoto(url: string): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud post para contáctanos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  contactUs(url: string, body: any): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(url, body, { headers });
  }
}
