import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductManagementService } from 'src/app/admin/services/product-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { getCategory } from 'src/app/admin/interfaces/category.interface';
import { getProductBrand } from 'src/app/admin/interfaces/product_brand.interface';
import { addProduct } from 'src/app/admin/interfaces/product.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  sidebarVisible = false;
  categories: getCategory[] = [];
  productsBrand: getProductBrand[] = [];
  registerForm!: FormGroup;
  pathRole: any = '';

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
    private ProductService: ProductManagementService,
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
      nombre: new FormControl('', [Validators.required, Validators.pattern(/^[^\[\]<>(){\\}|'';]+$/), Validators.minLength(3), Validators.maxLength(50)]),
      precio_venta: new FormControl(null, [Validators.required, Validators.min(1)]),
      precio_compra: new FormControl(null, [Validators.min(1)]),
      descripcion: new FormControl('', [Validators.pattern(/^[^\[\]<>(){\\}|'';]+$/), Validators.minLength(10), Validators.maxLength(200)]),
      cantidad: new FormControl(null, [Validators.required, Validators.min(1)]),
      destacado: new FormControl(*****************pendiente),
      categoria: new FormControl(null, [Validators.pattern('^[0-9]+$')]),
      marca: new FormControl(null, [Validators.pattern('^[0-9]+$')])
    });
  }
}
