import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AdminProfileService } from 'src/app/admin/services/admin-profile.service';
import { SharedService } from 'src/app/user/services/shared.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getEmployee } from 'src/app/admin/interfaces/employee.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{
  isNavBarVisible = false;
  searchMag: string = '';
  employee: getEmployee = {} as getEmployee;
  image: any = 'assets/transparent.png';
  permissions = false;
  pathRole: any = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private router: Router,
    private authService: AuthService,
    private adminService: AdminProfileService,
    private sharedService: SharedService,
    private customAlertService: CustomAlertService
  ) { }

  searchManagement() {
    const search = this.searchMag.toLowerCase().trim();

    if (search.indexOf('das') !== -1) {
      this.router.navigate(['/admin']);
    } else if (search.indexOf('per') !== -1 || search.indexOf('perfil') !== -1) {
      this.router.navigate(['/admin/profile']);
    } else if (search.indexOf('cli') !== -1) {
      this.router.navigate(['/admin/list/customers']);
    } else if (search.indexOf('adm') !== -1 || search.indexOf('admin') !== -1) {
      this.router.navigate(['/admin/list/admins']);
    } else if (search.indexOf('prov') !== -1) {
      this.router.navigate(['/admin/list/suppliers']);
    } else if (search.indexOf('cate') !== -1) {
      this.router.navigate(['/admin/list/categories']);
    } else if (search.indexOf('prod') !== -1) {
      this.router.navigate(['/admin/list/products']);
    } else if (search.indexOf('comp') !== -1) {
      this.router.navigate(['/admin/list/purchases']);
    } else if (search.indexOf('ven') !== -1) {
      this.router.navigate(['/admin/list/sales']);
    } else if (search.indexOf('inven') !== -1) {
      this.router.navigate(['/admin/list/inventories']);
    } else if (search.indexOf('news') !== -1) {
      this.router.navigate(['/admin/list/newsletter']);
    }
  }

  ngOnInit() {
    this.getProfilePicture();
    this.viewProfile();
    this.sharedService.profileImageUpdated.subscribe((imageUrl: string | null) => {
      this.image = imageUrl
    });
  }
  
  toggleNavBar() {
    this.isNavBarVisible = !this.isNavBarVisible;
    this.toggleNavBarService.setSidebarVisibility(this.isNavBarVisible);
    
    if (this.isNavBarVisible) {
      const contentElement = document.getElementById('content');

      if (contentElement) {
        contentElement.style.width = 'calc(100% - 280px)';
        contentElement.style.left = '280px';
      }
    } else if (!this.isNavBarVisible) {
      const contentElement = document.getElementById('content');

      if (contentElement) {
        contentElement.style.width = '';
        contentElement.style.left = '';
      }
    }
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
      this.permissions = true;
      return true;
    }

    this.pathRole = 'admin';
    this.permissions = false;
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
