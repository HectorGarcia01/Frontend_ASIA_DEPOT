import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToggleNavBarService } from 'src/app/admin/services/toggle-nav-bar.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CategoryManagementService } from 'src/app/admin/services/category-management.service';
import { ProductBrandManagementService } from 'src/app/admin/services/product-brand-management.service';
import { ProductManagementService } from 'src/app/admin/services/product-management.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { addCategory, getCategory } from 'src/app/admin/interfaces/category.interface';
import { addProductBrand, getProductBrand } from 'src/app/admin/interfaces/product_brand.interface';
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
  displayCategoryModal: boolean = false;
  displayBrandModal: boolean = false;
  categories: getCategory[] = [];
  productsBrand: getProductBrand[] = [];
  registerForm!: FormGroup;
  registerCategoryForm!: FormGroup;
  registerBrandForm!: FormGroup;
  pathRole: any = '';
  loading = false;

  constructor(
    private toggleNavBarService: ToggleNavBarService,
    private authService: AuthService,
    private categoryService: CategoryManagementService,
    private productBrandService: ProductBrandManagementService,
    private productService: ProductManagementService,
    private customAlertService: CustomAlertService,
    private router: Router
  ) {
    this.toggleNavbarStatus();
    this.validateForm();
  }

  ngOnInit() {
    this.isSuperAdmin();
    this.getCategories();
    this.getProductBrand();
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
   * Función para consumir el servicio de ver todas las categorías
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCategories del servicio de categoria (category-management.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)  
   */

  getCategories() {
    try {
      this.categoryService.getCategories(`${apiURL}/${this.pathRole}/ver/categorias`).subscribe({
        next: (data: any) => {
          this.categories = data.categories;
        },
        error: (error: any) => {
          console.log(error.error.error);
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de ver todas las categorías
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getProductsBrand del servicio de marca de producto (product-brand-management.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)  
   */

  getProductBrand() {
    try {
      this.productBrandService.getProductsBrand(`${apiURL}/${this.pathRole}/ver/marcas`).subscribe({
        next: (data: any) => {
          this.productsBrand = data.productBrands;
        },
        error: (error: any) => {
          console.log(error.error.error);
        }
      });
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
    this.registerForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern(/^[^\[\]<>(){\\}|'';]+$/), Validators.minLength(3), Validators.maxLength(50)]),
      precio_venta: new FormControl(null, [Validators.required, Validators.min(1)]),
      precio_compra: new FormControl(null, [Validators.min(1)]),
      descripcion: new FormControl('', [Validators.pattern(/^[^\[\]<>(){\\}|'';]+$/), Validators.minLength(10), Validators.maxLength(200)]),
      cantidad: new FormControl(null, [Validators.pattern('^[0-9]+$'), Validators.required, Validators.min(1)]),
      codigo: new FormControl('', [Validators.minLength(5), Validators.maxLength(200)]),
      destacado: new FormControl(false, [Validators.required]),
      categoria: new FormControl(null, [Validators.pattern('^[0-9]+$')]),
      marca: new FormControl(null, [Validators.pattern('^[0-9]+$')])
    });

    this.registerCategoryForm = new FormGroup({
      nombre_categoria: new FormControl('', [Validators.required, Validators.pattern(/^[^\[\]<>(){\\}|'';]+$/), Validators.minLength(3), Validators.maxLength(50)]),
      descripcion_categoria: new FormControl('', [Validators.pattern(/^[^\[\]<>(){\\}|'';]+$/), Validators.minLength(10), Validators.maxLength(200)])
    });

    this.registerBrandForm = new FormGroup({
      nombre_marca: new FormControl('', [Validators.required, Validators.pattern(/^[^\[\]<>(){\\}|'';]+$/), Validators.minLength(3), Validators.maxLength(50)])
    });
  }

  /**
     * Función para obtener todos los datos del formulario reactivo
     * Fecha creación: 20/10/2023
     * Autor: Hector Armando García González
     */

  getProductData() {
    const product: addProduct = {
      Nombre_Producto: this.registerForm.get('nombre')?.value,
      Precio_Venta: this.registerForm.get('precio_venta')?.value,
      Precio_Compra: this.registerForm.get('precio_compra')?.value,
      Descripcion_Producto: this.registerForm.get('descripcion')?.value,
      Cantidad_Stock: this.registerForm.get('cantidad')?.value,
      Codigo_Barras: this.registerForm.get('codigo')?.value,
      Producto_Destacado: this.registerForm.get('destacado')?.value,
      ID_Categoria_FK: this.registerForm.get('categoria')?.value,
      ID_Marca_FK: this.registerForm.get('marca')?.value
    };

    for (const key in product) {
      if (product.hasOwnProperty(key) && (product[key] === null || product[key] === undefined || product[key] === '')) {
        delete product[key];
      }
    }

    if (Object.keys(product).length === 0) {
      return null;
    }

    return product;
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
   * Función para consumir el servicio para crear nueva categoría
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función createCategory del servicio de category (category-management.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  saveNewCategory() {
    try {
      if (this.registerCategoryForm.valid) {
        const categoryData = this.getCategoryData();
        this.categoryService.createCategory(`${apiURL}/${this.pathRole}/crear/categoria`, categoryData).subscribe({
          next: (data: any) => {
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
            this.getCategories();
          },
          error: (error: any) => {
            this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
          }
        });
        this.registerCategoryForm.reset();
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio para crear nueva marca de producto
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función createProductBrand del servicio de marca de producto (product-brand-management.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  saveNewBrand() {
    try {
      if (this.registerBrandForm.valid) {
        const brandData = this.getProductBrandData();
        this.productBrandService.createProductBrand(`${apiURL}/${this.pathRole}/crear/marca`, brandData).subscribe({
          next: (data: any) => {
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
            this.getProductBrand();
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

  /**
   * Función para consumir el servicio para crear nuevo producto
   * Fecha creación: 20/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función createProduct del servicio de producto (product-management.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onSubmit() {
    try {
      if (this.registerForm.valid) {
        this.loading = true;
        const productData = this.getProductData();
        this.productService.createProduct(`${apiURL}/${this.pathRole}/crear/producto`, productData).subscribe({
          next: (response: any) => {
            this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", response.msg);
            this.registerForm.reset();
            this.loading = false;
            this.router.navigate(['/admin/list/products']);
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
