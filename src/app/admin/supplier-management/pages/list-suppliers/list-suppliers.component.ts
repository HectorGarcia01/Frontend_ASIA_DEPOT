import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SupplierManagementService } from 'src/app/admin/services/supplier-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getSupplier } from 'src/app/admin/interfaces/supplier.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-suppliers',
  templateUrl: './list-suppliers.component.html',
  styleUrls: ['./list-suppliers.component.css']
})
export class ListSuppliersComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  suppliers: getSupplier[] = [];
  permissions = false;
  pathRole: any = '';
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  searchQuery: string = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
    private supplierService: SupplierManagementService,
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
    this.getSuppliers();
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
   * Función para consumir el servicio de ver todos los proveedores
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getSuppliers del servicio de proveedor (supplier-management.service)   
   */

  getSuppliers() {
    try {
      this.supplierService.getSuppliers(`${apiURL}/${this.pathRole}/ver/proveedores`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.suppliers = data.suppliers;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.suppliers.forEach((supplier: any) => {
            if (supplier.createdAt) {
              const createdDate = supplier.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              supplier.createdAt = newDateCreate;
            }
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
    this.searchSuppliers(this.searchQuery);
  }

  searchSuppliers(query: string) {
    try {
      this.supplierService.getSuppliers(`${apiURL}/${this.pathRole}/ver/proveedores?nombre=${query}`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.suppliers = data.suppliers;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.suppliers.forEach((supplier: any) => {
            if (supplier.createdAt) {
              const createdDate = supplier.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              supplier.createdAt = newDateCreate;
            }
          });
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
   * Función para consumir el servicio de eliminar un proveedor
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función deleteSupplier del servicio de proveedor (supplier-management.service)   
   */

  deleteSupplier(id: any) {
    try {
      this.supplierService.deleteSupplier(`${apiURL}/superAdmin/eliminar/proveedor`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getSuppliers();
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
   * Función para consumir el servicio de activar un proveedor
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función activateSupplier del servicio de proveedor (supplier-management.service)   
   */

  activateSupplier(id: any) {
    try {
      this.supplierService.activateSupplier(`${apiURL}/superAdmin/activar/proveedor`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getSuppliers();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  getSupplierName(supplier: any): string {
    let paramsName;
    if (supplier.Nombre_Proveedor) {
      paramsName = supplier.Nombre_Proveedor;
    } else if (supplier.Nombre_Empresa) {
      paramsName = supplier.Nombre_Empresa;
    } else {
      paramsName = ''
    }

    return paramsName.toLowerCase().replace(/ /g, '-');
  }

  /**
   * Función para cambiar de página
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getSuppliers
   */

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getSuppliers();
      this.scrollToTop();
    }
  }

  /**
   * Función para cambiar el número de registros
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getSuppliers
   */

  changePageSize(event: Event) {
    const element = event.target as HTMLSelectElement;
    this.pageSize = +element.value;
    this.currentPage = 1;
    this.getSuppliers();
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
