import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { apiURL } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private roleSubject = new BehaviorSubject<string>(null!);
  role$ = this.roleSubject.asObservable();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) { }

  /**
   * Función para realizar una solicitud post de inicio de sesión
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  singIn(url: string, user: any): Observable<any> {
    return this.http.post<any>(url, user).pipe(
      tap((data: any) => {
        this.roleSubject.next(data.userRole);
      })
    );
  };

  /**
   * Función para guardar la cookie de autenticación
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  saveCookieAuth(userToken: string) {
    this.cookieService.set('authCookie', userToken);
  }

  /**
   * Función para guardar la cookie del rol de usuario
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  saveCookieRole(userRole: string) {
    this.cookieService.set('roleCookie', userRole);
  }

  /**
   * Función para obtener la cookie de autenticación de usuario
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getCookieAuth() {
    return this.cookieService.get('authCookie');
  }

  /**
   * Función para obtener la cookie del rol de usuario
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getCookieRole() {
    return this.cookieService.get('roleCookie');
  }

  /**
   * Función para validar si está autenticado
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  isAuthenticated(): boolean {
    return this.cookieService.check('authCookie');
  }

  /**
   * Función para eliminar las cookies
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  deleteCookie() {
    this.cookieService.delete('authCookie');
    this.cookieService.delete('roleCookie');
    this.router.navigate(['/home']);
  }

  /**
   * Función para realizar una solicitud post para cerrar la sesión actual
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  logout(): Observable<any> {
    const token = this.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(`${apiURL}/usuario/logout`, null, { headers });
  }

  /**
   * Función para realizar una solicitud post para cerrar todas las sesiones
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  logoutAll(): Observable<any> {
    const token = this.getCookieAuth();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<any>(`${apiURL}/usuario/logoutAll`, null, { headers });
  }
}
