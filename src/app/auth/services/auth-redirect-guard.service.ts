import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuardService {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  /**
   * Función para validar la protección de rutas de login y registro
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función isAuthenticated del servicio de autenticación (auth.service),
   *            Función getRole del servicio de autenticación (auth.service)
   */

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getCookieRole();
      
      if (userRole === 'Admin' || userRole === 'SuperAdmin') {
        this.router.navigate(['/admin']);        
        return false;
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    } else {
      return true;
    }
  }
}
