import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductManagementService } from 'src/app/admin/services/product-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getProduct } from 'src/app/admin/interfaces/product.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.css']
})
export class ListProductsComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  products: getProduct[] = [];
  productImages: { [key: number]: string } = {};
  image: any = 'assets/transparent.png';
  permissions = false;
  pathRole: any = '';
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 8;
  searchQuery: string = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
    private productService: ProductManagementService,
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
    this.getProducts();
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
   * Función para consumir el servicio de ver todos los productos
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getProducts del servicio de producto (product-management.service)   
   */

  getProducts() {
    try {
      this.productService.getProducts(`${apiURL}/${this.pathRole}/ver/productos`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.products = data.products;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.products.forEach((product: any) => {
            if (product.createdAt) {
              const createdDate = product.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              product.createdAt = newDateCreate;
            }

            if (!product.Precio_Compra) {
              product.Precio_Compra = 0;
            }

            this.getPhotos(product.id);
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
    this.searchProducts(this.searchQuery);
  }

  searchProducts(query: string) {
    try {
      this.productService.getProducts(`${apiURL}/${this.pathRole}/ver/productos?nombre=${query}`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.products = data.products;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.products.forEach((product: any) => {
            if (product.createdAt) {
              const createdDate = product.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              product.createdAt = newDateCreate;
            }

            if (!product.Precio_Compra) {
              product.Precio_Compra = 0;
            }

            this.getPhotos(product.id);
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
   * Función para consumir el servicio de ver la imágen de cada producto
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getPhotos del servicio de producto (product-management.service)   
   */

  getPhotos(id: any) {
    try {
      this.productService.getPhotos(`${apiURL}/${this.pathRole}/ver/foto/producto`, id).subscribe({
        next: (data: Blob) => {
          this.productImages[id] = URL.createObjectURL(data);
        },
        error: (error: any) => {
          this.productImages[id] = 'assets/Logo_ASIA_DEPOT.png';
          console.log(error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de eliminar un producto
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función deleteProduct del servicio de producto (product-management.service)   
   */

  updateProduct(id: number, featuredProduct: boolean) {
    try {
      const productData = { Producto_Destacado: !featuredProduct };
      this.productService.updateProduct(`${apiURL}/${this.pathRole}/actualizar/producto`, id, productData).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getProducts();
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
   * Función para consumir el servicio de eliminar un producto
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función deleteProduct del servicio de producto (product-management.service)   
   */

  deleteProduct(id: any) {
    try {
      this.productService.deleteProduct(`${apiURL}/superAdmin/eliminar/producto`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getProducts();
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
   * Función para consumir el servicio de activar un producto
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función activateProduct del servicio de producto (product-management.service)   
   */

  activateEmployee(id: any) {
    try {
      this.productService.activateProduct(`${apiURL}/superAdmin/activar/producto`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getProducts();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  getProductName(product: any): string {
    return product.Nombre_Producto.toLowerCase().replace(/ /g, '-');
  }

  /**
   * Función para cambiar de página
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCategories
   */

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getProducts();
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
    this.getProducts();
  }

  /**
   * Función para obtener el número de páginas
   * Fecha creación: 06/10/2023
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
