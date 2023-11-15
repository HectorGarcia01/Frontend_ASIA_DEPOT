import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CategoryManagementService } from 'src/app/admin/services/category-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getCategory } from 'src/app/admin/interfaces/category.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css']
})
export class ListCategoriesComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  categories: getCategory[] = [];
  permissions = false;
  pathRole: any = '';
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  searchQuery: string = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
    private categoryService: CategoryManagementService,
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
    this.getCategories();
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
   *            Función getCategories del servicio de categoria (category-management.service)   
   */

  getCategories() {
    try {
      this.categoryService.getCategories(`${apiURL}/${this.pathRole}/ver/categorias/paginacion`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.categories = data.categories;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.categories.forEach((category: any) => {
            if (category.createdAt) {
              const createdDate = category.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              category.createdAt = newDateCreate;
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
    this.searchCategories(this.searchQuery);
  }

  searchCategories(query: string) {
    try {
      this.categoryService.getCategories(`${apiURL}/${this.pathRole}/ver/categorias/paginacion?nombre=${query}`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.categories = data.categories;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;

          this.categories.forEach((category: any) => {
            if (category.createdAt) {
              const createdDate = category.createdAt;
              const parts = createdDate.split('T');
              const newDateCreate = parts[0];

              category.createdAt = newDateCreate;
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
   * Función para consumir el servicio de eliminar una categoría
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función deleteCategory del servicio de categoria (category-management.service)   
   */

  deleteCategory(id: any) {
    try {
      this.categoryService.deleteCategory(`${apiURL}/superAdmin/eliminar/categoria`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getCategories();
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
   * Función para consumir el servicio de activar una categoría
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función activateCategory del servicio de categoría (category-management.service)   
   */

  activateCategory(id: any) {
    try {
      this.categoryService.activateCategory(`${apiURL}/superAdmin/activar/categoria`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getCategories();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      })
    } catch (error: any) {
      console.log(error.error);
    }
  }

  getCategoryName(category: any): string {
    return category.Nombre_Categoria.toLowerCase().replace(/ /g, '-');
  }

  /**
   * Función para cambiar de página
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCategories
   */

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getCategories();
      this.scrollToTop();
    }
  }

  /**
   * Función para cambiar el número de registros
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCategories
   */

  changePageSize(event: Event) {
    const element = event.target as HTMLSelectElement;
    this.pageSize = +element.value;
    this.currentPage = 1;
    this.getCategories();
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
