import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SalesManagementService } from 'src/app/admin/services/sales-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getSaleDetail } from 'src/app/admin/interfaces/sales_invoice.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-sale',
  templateUrl: './list-sale.component.html',
  styleUrls: ['./list-sale.component.css']
})
export class ListSaleComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  saleDetail: getSaleDetail = {} as getSaleDetail;
  pathRole: any = '';
  error404: boolean = false;

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
    private route: ActivatedRoute,
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
    this.getParamsId();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleNavbarStatus() {
    this.subscription = this.toggleNavBarService.sidebarVisibility$.subscribe((isVisible) => {
      this.sidebarVisible = isVisible;

      const contentElement = document.getElementById('contentMove');
      const contentElementTwo = document.getElementById('contentMoveTwo');

      if (contentElement && contentElementTwo) {
        if (this.sidebarVisible) {
          contentElement.style.width = 'calc(100% - 280px)';
          contentElement.style.left = '280px';
          contentElementTwo.style.width = 'calc(100% - 280px)';
          contentElementTwo.style.left = '280px';
        } else {
          contentElement.style.width = '100%';
          contentElement.style.left = '0';
          contentElementTwo.style.width = '100%';
          contentElementTwo.style.left = '0';
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
      const salesDetailId = params.get('id');

      if (salesDetailId) {
        this.getSalesDetail(salesDetailId);
      }
    });
  }

  /**
   * Función para consumir el servicio de ver el detalle de venta
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getSaleInvoiceId del servicio de ventas (sales-management.service)   
   */

  getSalesDetail(id: any) {
    try {
      this.salesService.getSaleInvoiceId(`${apiURL}/${this.pathRole}/ver/venta`, id).subscribe({
        next: (data: any) => {
          this.saleDetail = data.salesInvoice;

          if (this.saleDetail.createdAt) {
            const createdDate = this.saleDetail.createdAt;
            const parts = createdDate.split('T');
            const newDateCreate = parts[0];

            this.saleDetail.createdAt = newDateCreate;
          }

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

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
