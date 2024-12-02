import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { SharedService } from 'src/app/user/services/shared.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  image: any = 'assets/transparent.png';

  constructor(
    private authService: AuthService,
    private userService: UserServicesService,
    private sharedService: SharedService,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit() {
    this.getProfilePicture();
    this.sharedService.profileImageUpdated.subscribe((imageUrl: string | null) => {
      this.image = imageUrl
    });
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
   *            Función logout() del servicio de autenticación (auth.service),
   *            Función del servicio de alerta personalizada (custom-alert.service)
   */

  logout(): void {
    try {
      this.authService.logout().subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.authService.deleteCookie();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para ver la foto de perfil del cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función isAuthenticated() del servicio de autenticación (auth.service),
   *            Función getProfilePhoto() del servicio de usuario (user-service.service),
   *            Función del servicio de alerta personalizada (custom-alert.service)
   */

  getProfilePicture() {
    try {
      if (this.authService.isAuthenticated()) {
        this.userService.getProfilePhoto(`${apiURL}/usuario/ver/avatar`).subscribe({
          next: (data: Blob) => {
            this.image = URL.createObjectURL(data);
          },
          error: (error: any) => {
            this.image = 'assets/perfil_picture.png';
          }
        })
      } else {
        this.image = 'assets/perfil_picture.png';
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }
}
