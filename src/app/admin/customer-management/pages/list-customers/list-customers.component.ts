import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CustomerManagementService } from 'src/app/admin/services/customer-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getCustomer } from 'src/app/user/interfaces/customer.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-customers',
  templateUrl: './list-customers.component.html',
  styleUrls: ['./list-customers.component.css']
})
export class ListCustomersComponent {
  subscription!: Subscription;
  sidebarVisible = false;
  customers: getCustomer[] = [];
  image: any = 'assets/transparent.png';
  customerImages: { [key: number]: string } = {};
  permissions = false;
  pathRole: any = '';
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  searchQuery: string = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
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
    this.scrollToTop();
    this.isSuperAdmin();
    this.getCustomers();
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
   * Función para consumir el servicio de ver todos los clientes
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomers del servicio de cliente (customer-management.service)   
   */

  getCustomers() {
    try {
      this.customerService.getCustomers(`${apiURL}/${this.pathRole}/ver/clientes`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.customers = data.customers;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.customers.forEach((customer: any) => {
            if (customer.createdAt) {
              const createdDate = customer.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              customer.createdAt = newDateCreate;
            }

            this.getPhotos(customer.id);
          });
        },
        error: (error: any) => {
          console.log(error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  onSearch(event: Event) {
    event.preventDefault();
    this.searchCustomers(this.searchQuery);
  }

  searchCustomers(query: string) {
    try {
      this.customerService.getCustomers(`${apiURL}/${this.pathRole}/ver/clientes?nombre=${query}`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.customers = data.customers;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.customers.forEach((customer: any) => {
            if (customer.createdAt) {
              const createdDate = customer.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              customer.createdAt = newDateCreate;
            }

            this.getPhotos(customer.id);
          });
        },
        error: (error: any) => {
          console.log(error.error.error);
        }
      });
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

  getPhotos(id: any) {
    try {
      this.customerService.getPhotos(`${apiURL}/${this.pathRole}/ver/avatar/cliente`, id).subscribe({
        next: (data: Blob) => {
          this.customerImages[id] = URL.createObjectURL(data);
        },
        error: (error: any) => {
          this.customerImages[id] = 'assets/perfil_picture.png';
          console.log(error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de eliminar un cliente
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función deleteCustomer del servicio de cliente (customer-management.service)   
   */

  deleteCustomer(id: any) {
    try {
      this.customerService.deleteCustomer(`${apiURL}/superAdmin/eliminar/cliente`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getCustomers();
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
          this.getCustomers();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  getCustomerName(customer: any): string {
    return customer.Nombre_Cliente.toLowerCase().replace(/ /g, '-');
  }

  /**
   * Función para cambiar de página
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomers
   */

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getCustomers();
      this.scrollToTop();
    }
  }

  /**
   * Función para cambiar el número de registros
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomers
   */

  changePageSize(event: Event) {
    const element = event.target as HTMLSelectElement;
    this.pageSize = +element.value;
    this.currentPage = 1;
    this.getCustomers();
  }

  /**
   * Función para obtener el número de páginas
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   */

  getPagesArray(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
