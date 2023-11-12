import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SupplierManagementService } from 'src/app/admin/services/supplier-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { addSupplier } from 'src/app/admin/interfaces/supplier.interface';
import { apiURL } from 'src/app/config/config';
@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.css']
})
export class NewSupplierComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  registerForm!: FormGroup;
  pathRole: any = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
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
    this.registerForm = new FormGroup({
      nombre: new FormControl('', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(30)]),
      apellido: new FormControl('', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(3), Validators.maxLength(30)]),
      empresa: new FormControl('', [Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/), Validators.minLength(5), Validators.maxLength(50)]),
      telefono: new FormControl('', [Validators.required, Validators.pattern(/^[345][0-9]{7}$/)]),
      correo: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(40)])
    });
  }

  /**
     * Función para obtener todos los datos del formulario reactivo
     * Fecha creación: 20/10/2023
     * Autor: Hector Armando García González
     */

  getSupplierData() {
    const supplier: addSupplier = {
      Nombre_Proveedor: this.registerForm.get('nombre')?.value,
      Apellido_Proveedor: this.registerForm.get('apellido')?.value,
      Nombre_Empresa: this.registerForm.get('empresa')?.value,
      Telefono_Proveedor: this.registerForm.get('telefono')?.value,
      Correo_Proveedor: this.registerForm.get('correo')?.value,
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
   * Función para consumir el servicio para crear nuevo proveedor
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función createSupplier del servicio de proveedor (supplier-management.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onSubmit() {
    try {
      if (this.registerForm.valid) {
        const supplierData = this.getSupplierData();

        this.supplierService.createSupplier(`${apiURL}/${this.pathRole}/nuevo/proveedor`, supplierData).subscribe({
          next: (response: any) => {
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
            this.registerForm.reset();
            this.router.navigate(['/admin/list/suppliers']);
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
