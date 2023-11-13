import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CustomerManagementService } from 'src/app/admin/services/customer-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getCustomer } from 'src/app/user/interfaces/customer.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.css']
})
export class ListCustomerComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  customer: getCustomer = {} as getCustomer;
  image: any = 'assets/transparent.png';
  error404: boolean = false;
  permissions = false;
  pathRole: any = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private customerService: CustomerManagementService,
    private customAlertService: CustomAlertService
  ) {
    this.toggleNavbarStatus();
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

  ngOnInit() {
    this.isSuperAdmin();
    this.getParamsId();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleNavbarStatus() {
    this.subscription = this.toggleNavBarService.sidebarVisibility$.subscribe((isVisible) => {
      this.sidebarVisible = isVisible;

      const contentElement = document.getElementById('contentMove');

      if (contentElement) {
        if (this.sidebarVisible) {
          contentElement.style.width = 'calc(100% - 280px)';
          contentElement.style.left = '280px';
        } else {
          contentElement.style.width = '100%';
          contentElement.style.left = '0';
        }
      }
    });
  }

  /**
   * Función para obtener el id de los parámetros de la url
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProductId que consume el servicio del backend
   */

  getParamsId() {
    this.route.paramMap.subscribe(params => {
      const customerId = params.get('id');

      if (customerId) {
        this.getCustomer(customerId);
      }
    });
  }

  /**
   * Función para consumir el servicio de ver un cliente
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomerId del servicio de cliente (customer-management.service)   
   */

  getCustomer(id: any) {
    try {
      this.customerService.getCustomerId(`${apiURL}/${this.pathRole}/ver/cliente`, id).subscribe({
        next: (data: any) => {
          this.customer = data.customer;

          if (this.customer.createdAt) {
            const createdDate = this.customer.createdAt;
            const parts = createdDate.split('T');
            const newDateCreate = parts[0];

            this.customer.createdAt = newDateCreate;
          }
          this.getCustomerAvatar(this.customer.id);
          this.error404 = false;
        },
        error: (error: any) => {
          this.error404 = true;
          console.log(error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de ver la foto de perfil de cada cliente
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getPhotos del servicio de cliente (customer-management.service)   
   */

  getCustomerAvatar(id: any) {
    try {
      this.customerService.getPhotos(`${apiURL}/${this.pathRole}/ver/avatar/cliente`, id).subscribe({
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
   * Función para consumir el servicio para eliminar un cliente
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función deleteCustomer del servicio de cliente (customer-management.service)   
   */

  deleteCustomer(id: any) {
    try {
      this.customerService.deleteCustomer(`${apiURL}/${this.pathRole}/eliminar/cliente`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getParamsId();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de activar un cliente
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función activateCustomer del servicio de cliente (customer-management.service)   
   */

  activateCustomer(id: any) {
    try {
      this.customerService.activateCustomer(`${apiURL}/superAdmin/activar/cliente`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getParamsId();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }
}
