import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Función para validar la protección de rutas del admin/superAdmin
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getRole();

      if (userRole === 'admin' || userRole === 'superAdmin') {
        return true;
      } else {
        //***************por el momento un alert xd */
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
