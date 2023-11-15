import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CategoryManagementService } from 'src/app/admin/services/category-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getCategory, updateCategory } from 'src/app/admin/interfaces/category.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  categoryId: any = '';
  category: getCategory = {} as getCategory;
  updateForm!: FormGroup;
  permissions = false;
  pathRole: any = '';
  error404: boolean = false;

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private categoryService: CategoryManagementService,
    private customAlertService: CustomAlertService,
    private router: Router
  ) {
    this.toggleNavbarStatus();
    this.validateForm();
  }

  ngOnInit() {
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
      this.categoryId = params.get('id');
      this.getCategoryId(this.categoryId);
    });
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

  /**
   * Función para consumir el servicio de ver una categoría
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getSuppliers del servicio de proveedor (supplier-management.service)   
   */

  getCategoryId(id: any) {
    try {
      this.categoryService.getCategoryId(`${apiURL}/${this.pathRole}/ver/categoria`, id).subscribe({
        next: (data: any) => {
          this.category = data.category;
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
   * Función privada para la definición de un formulario reactivo
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   */

  private validateForm() {
    this.updateForm = new FormGroup({
      nombre: new FormControl('', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(50)]),
      descripcion: new FormControl('', [Validators.pattern(/^[^[\]<>(){}_=\\|';]+$/), Validators.minLength(10), Validators.maxLength(200)])
    });
  }

  /**
     * Función para obtener todos los datos del formulario reactivo
     * Fecha creación: 20/10/2023
     * Autor: Hector Armando García González
     */

  getCategoryData() {
    const category: updateCategory = {
      Nombre_Categoria: this.updateForm.get('nombre')?.value,
      Descripcion_Categoria: this.updateForm.get('descripcion')?.value
    };

    for (const key in category) {
      if (category.hasOwnProperty(key) && (category[key] === null || category[key] === undefined || category[key] === '')) {
        delete category[key];
      }
    }

    if (Object.keys(category).length === 0) {
      return null;
    }

    return category;
  }

  /**
   * Función para consumir el servicio de actualización de datos del proveedor
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función updateSupplier del servicio de proveedor (supplier-management.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onSubmit() {
    try {
      if (this.updateForm.valid) {
        const categoryData = this.getCategoryData();

        if (categoryData) {
          this.categoryService.updateCategory(`${apiURL}/${this.pathRole}/actualizar/categoria`, this.categoryId, categoryData).subscribe({
            next: (response: any) => {
              this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
              this.updateForm.reset();
              this.router.navigate(['/admin/list/categories']);
            },
            error: (error: any) => {
              this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
            }
          });
        } else {
          this.customAlertService.sweetAlertPersonalizada('success', "Sin cambios", "No has realizado ningún cambio.");
          this.router.navigate(['/admin/list/categories']);
        }
      } else {
        this.customAlertService.sweetAlertPersonalizada('error', "Error", "Por favor, verifica los campos del formulario.");
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }
}
