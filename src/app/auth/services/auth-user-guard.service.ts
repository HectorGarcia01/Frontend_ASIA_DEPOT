import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthUserGuardService {

  constructor(
    private authService: AuthService, 
    private customAlertService: CustomAlertService,
    private router: Router
  ) { }

  /**
   * Función para validar la protección de rutas del user
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función isAuthenticated del servicio de autenticación (auth.service),
   *            Función getRole del servicio de autenticación (auth.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getCookieRole();

      if (userRole === 'Admin' || userRole === 'SuperAdmin') {
        this.customAlertService.sweetAlertPersonalizada('error', "Permisos denegados", "No posees los permisos necesarios");
        this.router.navigate(['/admin']);
        return false;
      } else {
        return true;
      }
    } else {
      this.customAlertService.sweetAlertPersonalizada('error', "Error de autenticación", "Primero debes de iniciar sesión");
      this.router.navigate(['/login']);
      return false;
    }
  }
}
