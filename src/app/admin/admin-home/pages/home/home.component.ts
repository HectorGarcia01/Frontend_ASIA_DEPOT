import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AdminProfileService } from 'src/app/admin/services/admin-profile.service';
import { SharedService } from 'src/app/user/services/shared.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getEmployee } from 'src/app/admin/interfaces/employee.interface';
import { apiURL } from 'src/app/config/config';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  employee: getEmployee = {} as getEmployee;
  image: any = 'assets/transparent.png';
  pathRole: any = '';

  constructor(
    private authService: AuthService,
    private adminService: AdminProfileService,
    private sharedService: SharedService,
    private customAlertService: CustomAlertService,
  ) { }

  ngOnInit() {
    this.viewProfile();
    this.getProfilePicture();
  }

  /**
   * Función para verificar si es un SuperAdmin
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getCookieRole del servicio de autenticación (auth.service)
   */

  isSuperAdmin(): boolean {
    const userRole = this.authService.getCookieRole();

    if (userRole === 'SuperAdmin') {
      this.pathRole = 'superAdmin';
      return true;
    }

    this.pathRole = 'admin';
    return false;
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
      this.isSuperAdmin();
      this.adminService.getEmployeeProfile(`${apiURL}/${this.pathRole}/ver/perfil`).subscribe({
        next: (data: any) => {
          this.employee = data.employee;
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
   * Función para ver la foto de perfil del admin o superAdmin
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getProfilePhoto() del servicio de usuario (admin-profile.service),
   *            Función del servicio de alerta personalizada (custom-alert.service)
   */

  getProfilePicture() {
    try {
      this.isSuperAdmin();
      this.adminService.getProfilePhoto(`${apiURL}/${this.pathRole}/ver/avatar`).subscribe({
        next: (data: Blob) => {
          this.image = URL.createObjectURL(data);
        },
        error: (error: any) => {
          this.image = 'assets/perfil_picture.png';
        }
      })
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
      this.adminService.deleteProfilePhoto(`${apiURL}/${this.pathRole}/eliminar/avatar`).subscribe({
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
   * Función para cerrar la sesión del admin/superAdmin
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
   * Función para cerrar todas las sesiones del admin o superAdmin
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
}
