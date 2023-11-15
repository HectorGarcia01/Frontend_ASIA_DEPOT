import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductBrandManagementService } from 'src/app/admin/services/product-brand-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { addProductBrand } from 'src/app/admin/interfaces/product_brand.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-new-brand',
  templateUrl: './new-brand.component.html',
  styleUrls: ['./new-brand.component.css']
})
export class NewBrandComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  registerBrandForm!: FormGroup;
  pathRole: any = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
    private productBrandService: ProductBrandManagementService,
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
    this.registerBrandForm = new FormGroup({
      nombre_marca: new FormControl('', [Validators.required, Validators.pattern(/^[^\[\]<>(){\\}|'';]+$/), Validators.minLength(3), Validators.maxLength(50)])
    });
  }

  /**
     * Función para obtener todos los datos del formulario reactivo
     * Fecha creación: 20/10/2023
     * Autor: Hector Armando García González
     */

  getProductBrandData() {
    const productBrand: addProductBrand = {
      Nombre_Marca: this.registerBrandForm.get('nombre_marca')?.value,
    };

    for (const key in productBrand) {
      if (productBrand.hasOwnProperty(key) && (productBrand[key] === null || productBrand[key] === undefined || productBrand[key] === '')) {
        delete productBrand[key];
      }
    }

    if (Object.keys(productBrand).length === 0) {
      return null;
    }

    return productBrand;
  }

  /**
   * Función para consumir el servicio para crear nueva marca
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función createCategory del servicio de marca (brand-management.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onSubmit() {
    try {
      if (this.registerBrandForm.valid) {
        const brandData = this.getProductBrandData();
        this.productBrandService.createProductBrand(`${apiURL}/${this.pathRole}/crear/marca`, brandData).subscribe({
          next: (data: any) => {
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
            this.registerBrandForm.reset();
            this.router.navigate(['/admin/list/brands']);
          },
          error: (error: any) => {
            this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
          }
        });
        this.registerBrandForm.reset();
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }
}
