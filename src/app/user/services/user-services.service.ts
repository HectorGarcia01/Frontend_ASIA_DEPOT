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
   */

  getCustomerProfile(url: string): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud put para actualizar datos del cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  updateCustomer(url: string, customer: any): Observable<any> {
    return this.http.put<any>(url, customer);
  }

  /**
   * Función para realizar una solicitud post para subir una foto de perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  uploadProfilePhoto(url: string, avatar: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', avatar);
    return this.http.post<any>(url, formData);
  }

  /**
   * Función para realizar una solicitud get para ver la foto de perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getProfilePhoto(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  /**
   * Función para realizar una solicitud delete para borrar la foto de perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  deleteProfilePhoto(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }
}
