import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  /**
   * Función para validar si está autenticado
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  isAuthenticated(): boolean {
    return this.cookieService.check('authCookie');
  }

  /**
   * Función para cerrar sesión (eliminar cookie)
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  logout(): void {
    this.cookieService.delete('authCookie');
  }
}
