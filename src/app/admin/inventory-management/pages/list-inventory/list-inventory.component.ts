import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InventoryManagementService } from 'src/app/admin/services/inventory-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getInventoryDetail } from 'src/app/admin/interfaces/inventory.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.component.html',
  styleUrls: ['./list-inventory.component.css']
})
export class ListInventoryComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  inventory: getInventoryDetail = {} as getInventoryDetail;
  dataInventory: any = {};
  pathRole: any = '';
  error404: boolean = false;

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private inventoryService: InventoryManagementService,
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
      const inventoryId = params.get('id');

      if (inventoryId) {
        this.getInventory(inventoryId);
      }
    });
  }

  /**
   * Función para consumir el servicio de ver el detalle de un inventario
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getInventoryId del servicio de inventario (inventory-management.service)   
   */

  getInventory(id: any) {
    try {
      this.inventoryService.getInventoryId(`${apiURL}/${this.pathRole}/ver/inventario`, id).subscribe({
        next: (data: any) => {
          this.inventory = data.inventory;
          this.dataInventory.Nombre = this.inventory.producto.Nombre_Producto;
          this.dataInventory.Admin = `${this.inventory.empleado.Nombre_Empleado} ${this.inventory.empleado.Apellido_Empleado}`;

            if (this.inventory.createdAt) {
              const createdDate = this.inventory.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              this.inventory.createdAt = newDateCreate;
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

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
