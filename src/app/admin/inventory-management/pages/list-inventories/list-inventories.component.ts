import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InventoryManagementService } from 'src/app/admin/services/inventory-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getInventory } from 'src/app/admin/interfaces/inventory.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-inventories',
  templateUrl: './list-inventories.component.html',
  styleUrls: ['./list-inventories.component.css']
})
export class ListInventoriesComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  inventories: getInventory[] = [];
  pathRole: any = '';
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  searchQuery: string = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
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
    this.getInventories();
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
   * Función para consumir el servicio de ver todo el inventario
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getInventory del servicio de inventario (inventory-management.service)   
   */

  getInventories() {
    try {
      this.inventoryService.getInventory(`${apiURL}/${this.pathRole}/ver/inventarios`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.inventories = data.inventories;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.inventories.forEach((inventory: any) => {
            if (inventory.createdAt) {
              const createdDate = inventory.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              inventory.createdAt = newDateCreate;
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
    this.searchInventory(this.searchQuery);
  }

  searchInventory(query: string) {
    try {
      this.inventoryService.getInventory(`${apiURL}/${this.pathRole}/ver/inventarios?nombre=${query}`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.inventories = data.inventories;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.inventories.forEach((inventory: any) => {
            if (inventory.createdAt) {
              const createdDate = inventory.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              inventory.createdAt = newDateCreate;
            }
          });
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
   *            Función getInventories
   */

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getInventories();
      this.scrollToTop();
    }
  }

  /**
   * Función para cambiar el número de registros
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getInventories
   */

  changePageSize(event: Event) {
    const element = event.target as HTMLSelectElement;
    this.pageSize = +element.value;
    this.currentPage = 1;
    this.getInventories();
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
