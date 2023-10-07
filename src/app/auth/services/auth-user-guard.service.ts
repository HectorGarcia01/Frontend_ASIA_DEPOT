import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthUserGuardService {

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Función para validar la protección de rutas del user
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getRole();

      if (userRole === 'user') {
        return true;
      } else {
        ///**********************ALERTA TEMPORAL LUEGO MODIFICARLA */
        //LA ALERTA PONE LA PAGINA EN BLANCO PROBAR CON ALERT DE SWEET O SI NO UNA MODAL O ALGO ASÍ
        alert('No tienes los permisos necesarios!!!');
        return false;
      }
    } else {
      ///**********************ALERTA TEMPORAL LUEGO MODIFICARLA */
      //LA ALERTA PONE LA PAGINA EN BLANCO PROBAR CON ALERT DE SWEET O SI NO UNA MODAL O ALGO ASÍ
      alert('Primero debes de iniciar sesión!!!');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
