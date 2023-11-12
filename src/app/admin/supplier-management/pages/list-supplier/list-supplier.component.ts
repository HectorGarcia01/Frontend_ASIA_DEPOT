import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { SupplierManagementService } from 'src/app/admin/services/supplier-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getSupplier } from 'src/app/admin/interfaces/supplier.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-supplier',
  templateUrl: './list-supplier.component.html',
  styleUrls: ['./list-supplier.component.css']
})
export class ListSupplierComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  supplier: getSupplier = {} as getSupplier;
  error404: boolean = false;

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private route: ActivatedRoute,
    private supplierService: SupplierManagementService,
    private customAlertService: CustomAlertService
  ) {
    this.toggleNavbarStatus();
  }

  ngOnInit() {
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
      const supplierId = params.get('id');

      if (supplierId) {
        this.getSupplier(supplierId);
      }
    });
  }

  /**
   * Función para consumir el servicio de ver un proveedor
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getSupplierId del servicio de proveedor (supplier-management.service)   
   */

  getSupplier(id: any) {
    try {
      this.supplierService.getSupplierId(`${apiURL}/superAdmin/ver/proveedor`, id).subscribe({
        next: (data: any) => {
          this.supplier = data.supplier;

          if (this.supplier.createdAt) {
            const createdDate = this.supplier.createdAt;
            const parts = createdDate.split('T');
            const newDateCreate = parts[0];

            this.supplier.createdAt = newDateCreate;
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
   * Función para consumir el servicio para eliminar un proveedor
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
}
