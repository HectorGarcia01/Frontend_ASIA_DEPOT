import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

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
  }

  /**
   * Función para guardar la cookie
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  saveCookieAuth() {
    const token = this.cookieService.get('authCookie');
    this.cookieService.set('authCookie', token);
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
   * Función para obtener el rol del usuario
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  getRole(): string {
    return this.roleSubject.value;
  }

  /**
   * Función para cerrar sesión (eliminar cookie)
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  logout(): void {
    this.cookieService.delete('authCookie');
    this.router.navigate(['/home']);
  }
}
