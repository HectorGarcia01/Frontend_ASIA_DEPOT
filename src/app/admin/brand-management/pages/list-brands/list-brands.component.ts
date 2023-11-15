import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductBrandManagementService } from 'src/app/admin/services/product-brand-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getProductBrand } from 'src/app/admin/interfaces/product_brand.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-brands',
  templateUrl: './list-brands.component.html',
  styleUrls: ['./list-brands.component.css']
})
export class ListBrandsComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  producsBrand: getProductBrand[] = [];
  permissions = false;
  pathRole: any = '';
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  searchQuery: string = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
    private productBrandService: ProductBrandManagementService,
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
    this.getProductsBrand();
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
     * Función para consumir el servicio de ver todos las marcas
     * Fecha creación: 20/10/2023
     * Autor: Hector Armando García González
     * Referencias: 
     *            Función getCategories del servicio de marca (brand-management.service)   
     */

  getProductsBrand() {
    try {
      this.productBrandService.getProductsBrand(`${apiURL}/${this.pathRole}/ver/marcas`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.producsBrand = data.productBrands;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.producsBrand.forEach((brand: any) => {
            if (brand.createdAt) {
              const createdDate = brand.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              brand.createdAt = newDateCreate;
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
    this.searchBrands(this.searchQuery);
  }

  searchBrands(query: string) {
    try {
      this.productBrandService.getProductsBrand(`${apiURL}/${this.pathRole}/ver/marcas?nombre=${query}`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.producsBrand = data.productBrands;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.producsBrand.forEach((brand: any) => {
            if (brand.createdAt) {
              const createdDate = brand.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              brand.createdAt = newDateCreate;
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
   * Función para consumir el servicio de eliminar una marca
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función deleteProductBrand del servicio de marca (brand-management.service)   
   */

  deleteBrand(id: any) {
    try {
      this.productBrandService.deleteProductBrand(`${apiURL}/superAdmin/eliminar/marca`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getProductsBrand();
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
     * Función para consumir el servicio de activar una marca
     * Fecha creación: 20/10/2023
     * Autor: Hector Armando García González
     * Referencias: 
     *            Función activateProductBrand del servicio de marca (brand-management.service)   
     */

  activateBrand(id: any) {
    try {
      this.productBrandService.activateProductBrand(`${apiURL}/superAdmin/activar/marca`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getProductsBrand();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  getBrandName(brand: any): string {
    return brand.Nombre_Marca.toLowerCase().replace(/ /g, '-');
  }

  /**
   * Función para cambiar de página
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getProductsBrand
   */

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getProductsBrand();
      this.scrollToTop();
    }
  }

  /**
   * Función para cambiar el número de registros
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getProductsBrand
   */

  changePageSize(event: Event) {
    const element = event.target as HTMLSelectElement;
    this.pageSize = +element.value;
    this.currentPage = 1;
    this.getProductsBrand();
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
