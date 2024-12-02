import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductBrandManagementService } from 'src/app/admin/services/product-brand-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getProductBrand, updateProductBrand } from 'src/app/admin/interfaces/product_brand.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-update-brand',
  templateUrl: './update-brand.component.html',
  styleUrls: ['./update-brand.component.css']
})
export class UpdateBrandComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  productBrandId: any = '';
  productBrand: getProductBrand = {} as getProductBrand;
  updateForm!: FormGroup;
  permissions = false;
  pathRole: any = '';
  error404: boolean = false;

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private productBrandServie: ProductBrandManagementService,
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
   *            Función getBrandId que consume el servicio del backend
   */

  getParamsId() {
    this.route.paramMap.subscribe(params => {
      this.productBrandId = params.get('id');
      this.getBrandId(this.productBrandId);
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
   * Función para consumir el servicio de ver una marca
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getProductBrandId del servicio de marca (brand-management.service)   
   */

  getBrandId(id: any) {
    try {
      this.productBrandServie.getProductBrandId(`${apiURL}/${this.pathRole}/ver/marca`, id).subscribe({
        next: (data: any) => {
          this.productBrand = data.productBrand;
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
      nombre: new FormControl('', [Validators.pattern(/^[^\[\]<>(){\\}|'';]+$/), Validators.minLength(3), Validators.maxLength(50)]),
    });
  }

  /**
     * Función para obtener todos los datos del formulario reactivo
     * Fecha creación: 20/10/2023
     * Autor: Hector Armando García González
     */

  getProductBrandData() {
    const productBrand: updateProductBrand = {
      Nombre_Marca: this.updateForm.get('nombre')?.value,
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
        const brandData = this.getProductBrandData();

        if (brandData) {
          this.productBrandServie.updateProductBrand(`${apiURL}/${this.pathRole}/actualizar/marca`, this.productBrandId, brandData).subscribe({
            next: (response: any) => {
              this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
              this.updateForm.reset();
              this.router.navigate(['/admin/list/brands']);
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
