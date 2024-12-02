import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SalesManagementService } from 'src/app/admin/services/sales-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getSaleInvoice } from 'src/app/admin/interfaces/sales_invoice.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-sales',
  templateUrl: './list-sales.component.html',
  styleUrls: ['./list-sales.component.css']
})
export class ListSalesComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  salesInvoice: getSaleInvoice[] = [];
  pathRole: any = '';
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
    private salesService: SalesManagementService,
    private customAlertService: CustomAlertService
  ) {
    this.toggleNavbarStatus();
  }

  /**
   * Función para verificar si es un SuperAdmin
   * Fecha creación: 20/10/2023
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

  ngOnInit() {
    this.scrollToTop();
    this.isSuperAdmin();
    this.getSalesInvoice();
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
   * Función para consumir el servicio de ver todas las ventas
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getSalesInvoice del servicio de ventas (sales-management.service)   
   */

  getSalesInvoice() {
    try {
      this.salesService.getSalesInvoice(`${apiURL}/${this.pathRole}/ver/ventas`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.salesInvoice = data.salesInvoice;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.salesInvoice.forEach((saleInvoice: any) => {
            if (saleInvoice.createdAt) {
              const createdDate = saleInvoice.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              saleInvoice.createdAt = newDateCreate;
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
    this.searchSalesInvoice(this.searchQuery);
  }

  searchSalesInvoice(query: string) {
    try {
      this.salesService.getSalesInvoice(`${apiURL}/${this.pathRole}/ver/ventas?estado=${query}`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.salesInvoice = data.salesInvoice;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.salesInvoice.forEach((saleInvoice: any) => {
            if (saleInvoice.createdAt) {
              const createdDate = saleInvoice.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              saleInvoice.createdAt = newDateCreate;
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

  /**
   * Función para consumir el servicio de procesar venta de cliente
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función deleteCustomer del servicio de cliente (customer-management.service)   
   */

  SalesInvoiceProcess(id: any) {
    try {
      this.salesService.updateSaleInvoice(`${apiURL}/${this.pathRole}/actualizar/estado/venta/proceso`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getSalesInvoice();
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
   * Función para consumir el servicio de completar venta de cliente
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función updateSaleInvoice del servicio de ventas (sales-management.service)   
   */

  SalesInvoiceComplete(id: any) {
    try {
      this.salesService.updateSaleInvoice(`${apiURL}/${this.pathRole}/actualizar/estado/venta/completado`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getSalesInvoice();
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
   * Función para cambiar de página
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomers
   */

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getSalesInvoice();
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
    this.getSalesInvoice();
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
