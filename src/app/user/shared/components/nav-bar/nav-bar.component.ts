import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() {
    
  }

  /**
   * Función para verificar si el cliente está autenticado
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función isAuthenticated del servicio de autenticación (auth.service)
   */

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Función para cerrar la sesión del cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función logout() del servicio de autenticación (auth.service)
   */

  logout(): void {
    this.authService.logout();
  }
}
