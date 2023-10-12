import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  constructor(private http: HttpClient) { }

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
    return this.http.get<any>(url);
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

  uploadProfilePhoto(url: string, avatar: any): Observable<any> {
    return this.http.post<any>(url, avatar);
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
