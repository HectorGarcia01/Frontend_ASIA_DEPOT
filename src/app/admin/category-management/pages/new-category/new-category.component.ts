import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CategoryManagementService } from 'src/app/admin/services/category-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { addCategory } from 'src/app/admin/interfaces/category.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  registerCategoryForm!: FormGroup;
  pathRole: any = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
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

  /**
     * Función privada para la definición de un formulario reactivo
     * Fecha creación: 20/10/2023
     * Autor: Hector Armando García González
     */

  private validateForm() {
    this.registerCategoryForm = new FormGroup({
      nombre_categoria: new FormControl('', [Validators.required, Validators.pattern(/^[^\[\]<>(){\\}|'';]+$/), Validators.minLength(3), Validators.maxLength(50)]),
      descripcion_categoria: new FormControl('', [Validators.pattern(/^[^\[\]<>(){\\}|'';]+$/), Validators.minLength(10), Validators.maxLength(200)])
    });
  }

  /**
     * Función para obtener todos los datos del formulario reactivo
     * Fecha creación: 20/10/2023
     * Autor: Hector Armando García González
     */

  getCategoryData() {
    const category: addCategory = {
      Nombre_Categoria: this.registerCategoryForm.get('nombre_categoria')?.value,
      Descripcion_Categoria: this.registerCategoryForm.get('descripcion_categoria')?.value,
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
   * Función para consumir el servicio para crear nueva categoría
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función createCategory del servicio de category (category-management.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onSubmit() {
    try {
      if (this.registerCategoryForm.valid) {
        const categoryData = this.getCategoryData();
        this.categoryService.createCategory(`${apiURL}/${this.pathRole}/crear/categoria`, categoryData).subscribe({
          next: (data: any) => {
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
            this.registerCategoryForm.reset();
            this.router.navigate(['/admin/list/categories']);
          },
          error: (error: any) => {
            this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
          }
        });
      } else {
        this.customAlertService.sweetAlertPersonalizada('error', "Error", "Por favor, verifica los campos del formulario.");
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }
}
