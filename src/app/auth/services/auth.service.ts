import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
   * Función para cerrar sesión (eliminar cookies)
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  logout(): Observable<any> {
    return this.http.post<any>(`${apiURL}/usuario/logout`, null, { withCredentials: true }).pipe(
      tap((data: any) => {
        this.cookieService.delete('authCookie');
        this.cookieService.delete('roleCookie');
        this.router.navigate(['/home']);
      })
    );
  }
}
