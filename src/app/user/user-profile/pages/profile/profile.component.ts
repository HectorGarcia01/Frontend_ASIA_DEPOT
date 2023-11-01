import { Component, OnInit } from '@angular/core';
import { UserServicesService } from 'src/app/user/services/user-services.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SharedService } from 'src/app/user/services/shared.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { apiURL } from 'src/app/config/config';
import { getCustomer } from 'src/app/user/interfaces/customer.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  customer: getCustomer = {} as getCustomer;
  image: any = 'assets/transparent.png';

  constructor(
    private authService: AuthService,
    private userService: UserServicesService,
    private sharedService: SharedService,
    private customAlertService: CustomAlertService,
  ) { }

  ngOnInit(){
    this.scrollToTop();
    this.viewProfile();
    this.getProfilePicture();
  }

  /**
   * Función para consumir el servicio de ver perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomerProfile del servicio de usuarios (user-services.service)   
   */

  viewProfile() {
    try {
      this.userService.getCustomerProfile(`${apiURL}/usuario/ver/perfil`).subscribe({
        next: (data: any) => {
          this.customer = data.customer;
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
   * Función para consumir el servicio de ver la foto de perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función isAuthenticated del servicio de autenticación (auth.service),
   *            Función getProfilePhoto del servicio de usuarios (user-services.service)   
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

  /**
   * Función para eliminar la foto de perfil
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función deleteProfilePhoto() del servicio del cliente (user-services.service),
   *            Función del servicio de alerta personalizada (custom-alert.service)
   */

  deleteProfilePicture() {
    try {
      this.userService.deleteProfilePhoto(`${apiURL}/usuario/eliminar/avatar`).subscribe({
        next: (data: any) => {
          this.image = 'assets/perfil_picture.png';
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.sharedService.profileImageUpdated.emit('assets/perfil_picture.png');
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
   * Función para cerrar la sesión del cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función logout() del servicio de autenticación (auth.service),
   *            Función del servicio de alerta personalizada (custom-alert.service)
   */

  logout() {
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
   * Función para cerrar todas las sesiones del cliente
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función logoutAll() del servicio de autenticación (auth.service),
   *            Función del servicio de alerta personalizada (custom-alert.service)
   */

  logoutAll() {
    try {
      this.authService.logoutAll().subscribe({
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

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}