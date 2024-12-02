import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeManagementService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  /**
   * Función para realizar una solicitud post para crear empleado (admin)
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  createEmployee(url: string, employee: any): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(url, employee, { headers });
  }

  /**
   * Función para realizar una solicitud get para ver todos los empleados (Admin)
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getEmployees(url: string, page?: number, pageSize?: number): Observable<any> {
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
   * Función para realizar una solicitud get para ver las fotos de los empleados (Admin)
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
   * Función para realizar una solicitud get para ver un empleado (Admin) por id
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  getEmployeeId(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.get<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud delete para eliminar un empleado (Admin) por id
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  deleteEmployee(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.delete<any>(url, { headers });
  }

  /**
   * Función para realizar una solicitud patch para activar un empleado (Admin) por id
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *              Función getCookieAuth del servicio de autenticación (auth.service)
   */

  activateEmployee(url: string, id: number): Observable<any> {
    const token = this.authService.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    url = `${url}/${id}`;

    return this.http.patch<any>(url, null, { headers });
  }
}
