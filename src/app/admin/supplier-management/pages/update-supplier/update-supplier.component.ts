import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SupplierManagementService } from 'src/app/admin/services/supplier-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getSupplier, updateSupplier } from 'src/app/admin/interfaces/supplier.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.component.html',
  styleUrls: ['./update-supplier.component.css']
})
export class UpdateSupplierComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  supplierId: any = '';
  supplier: getSupplier = {} as getSupplier;
  updateForm!: FormGroup;
  permissions = false;
  pathRole: any = '';
  error404: boolean = false;

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private supplierService: SupplierManagementService,
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
      this.supplierId = params.get('id');
      this.getSupplierId(this.supplierId);
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
   * Función para consumir el servicio de ver un proveedor
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getSuppliers del servicio de proveedor (supplier-management.service)   
   */

  getSupplierId(id: any) {
    try {
      this.supplierService.getSupplierId(`${apiURL}/${this.pathRole}/ver/proveedor`, id).subscribe({
        next: (data: any) => {
          this.supplier = data.supplier;
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
      nombre: new FormControl('', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(30)]),
      apellido: new FormControl('', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(30)]),
      empresa: new FormControl('', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(5), Validators.maxLength(50)]),
      telefono: new FormControl('', [Validators.pattern(/^[345][0-9]{7}$/)]),
      correo: new FormControl('', [Validators.email, Validators.maxLength(40)])
    });
  }

  /**
     * Función para obtener todos los datos del formulario reactivo
     * Fecha creación: 20/10/2023
     * Autor: Hector Armando García González
     */

  getSupplierData() {
    const supplier: updateSupplier = {
      Nombre_Proveedor: this.updateForm.get('nombre')?.value,
      Apellido_Proveedor: this.updateForm.get('apellido')?.value,
      Nombre_Empresa: this.updateForm.get('empresa')?.value,
      Telefono_Proveedor: this.updateForm.get('telefono')?.value,
      Correo_Proveedor: this.updateForm.get('correo')?.value,
    };

    for (const key in supplier) {
      if (supplier.hasOwnProperty(key) && (supplier[key] === null || supplier[key] === undefined || supplier[key] === '')) {
        delete supplier[key];
      }
    }

    if (Object.keys(supplier).length === 0) {
      return null;
    }

    return supplier;
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
        const supplierData = this.getSupplierData();

        if (supplierData) {
          this.supplierService.updateSupplier(`${apiURL}/${this.pathRole}/actualizar/proveedor`, this.supplierId, supplierData).subscribe({
            next: (response: any) => {
              this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
              this.updateForm.reset();
              this.router.navigate(['/admin/list/suppliers']);
            },
            error: (error: any) => {
              this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
            }
          });
        } else {
          this.customAlertService.sweetAlertPersonalizada('success', "Sin cambios", "No has realizado ningún cambio.");
          this.router.navigate(['/admin/list/suppliers']);
        }
      } else {
        this.customAlertService.sweetAlertPersonalizada('error', "Error", "Por favor, verifica los campos del formulario.");
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }
}
