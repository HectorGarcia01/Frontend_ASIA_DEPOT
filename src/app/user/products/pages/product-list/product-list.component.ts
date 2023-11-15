import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductService } from 'src/app/user/services/product.service';
import { ShoppingCartService } from 'src/app/user/services/shopping-cart.service';
import { CategoryService } from 'src/app/user/services/category.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { Product, Products } from 'src/app/user/interfaces/product.interface';
import { Category, CategoryResponse } from 'src/app/user/interfaces/category.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  registerForm!: FormGroup;
  category: Category[] = [];
  product: Product[] = [];
  prducts: Products[] = [];
  productImages: { [key: number]: string } = {};
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 8;
  msgError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private categoryService: CategoryService,
    private customAlertService: CustomAlertService
  ) { 
    this.validateForm();
  }

  ngOnInit() {
    this.scrollToTop();
    this.getCategories();
    this.getParamsId();
  }

  /**
   * Función privada para la definición de un formulario reactivo
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   */

  private validateForm() {
    this.registerForm = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)])
    });
  }

  /**
   * Función para consumir el servicio de listar categorías
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCategories del servicio de categoría (category.service)
   */

  getCategories() {
    this.categoryService.getCategories(`${apiURL}/usuario/ver/categorias`)
      .subscribe((data: CategoryResponse) => {
        this.category = data.categories;
        this.totalPages = data.totalPages;
        this.currentPage = data.currentPage;
      });
  }

  /**
   * Función para obtener el id de los parámetros de la url
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProductId que consume el servicio del backend
   */

  getParamsId() {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');

      if (productId) {
        const idProduct = parseInt(productId);
        this.getProductsCategory(idProduct);
      } else {
        this.getProducts();
      }
    });
  }

  /**
   * Función para consumir servicio de listar todos los productos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProducts del servicio de productos (product.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  getProducts() {
    try {
      this.productService.getProducts(`${apiURL}/usuario/ver/productos?estado=Activo`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.product = data.products;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;
          this.msgError = '';

          this.product.forEach((producImage: any) => {
            this.getPhotos(producImage.id);
          });
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir servicio de listar todos los productos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProducts del servicio de productos (product.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  getProductsFilter() {
    try {
      if (this.registerForm.valid) {
        const nombre = this.registerForm.get('nombre')?.value;
        
        this.productService.getProducts(`${apiURL}/usuario/ver/productos?estado=Activo&nombre=${nombre}`).subscribe({
          next: (data: any) => {
            this.product = data.products;
            this.msgError = '';

            this.product.forEach((producImage: any) => {
              this.getPhotos(producImage.id);
            });
          },
          error: (error: any) => {
            this.msgError = error.error.error;
            this.product = [];
            this.totalPages = 0;
          }
        });
      } else {
        this.getProducts();
      }
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir servicio de listar todos los productos por categoría
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProducts del servicio de productos (product.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  getProductsCategory(categoria: number) {
    try {
      this.productService.getProducts(`${apiURL}/usuario/ver/productos/categoria?estado=Activo&categoria=${categoria}`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.product = data.products;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;
          this.msgError = '';

          this.product.forEach((producImage: any) => {
            this.getPhotos(producImage.id);
          });
        },
        error: (error: any) => {
          this.msgError = error.error.error;
          this.product = [];
          this.totalPages = 0;
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de ver la imágen de cada producto
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getProductPhoto del servicio de producto (product.service)   
   */

  getPhotos(id: any) {
    try {
      this.productService.getProductPhoto(`${apiURL}/usuario/ver/foto/producto`, id).subscribe({
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
   * Función para consumir servicio para agregar un producto a favoritos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función addFavoriteProduct del servicio de productos (product.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  addFavoriteProduct(id: number) {
    try {
      if (!this.authService.isAuthenticated()) {
        return this.customAlertService.sweetAlertPersonalizada('error', "Sin autenticación", "Para agregar un producto a favoritos primero debes de iniciar sesión.");
      }

      this.productService.addFavoriteProduct(`${apiURL}/usuario/agregar/producto/favorito`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Lo siento", error.error.error);
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
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

  /**
   * Función para consumir servicio para agregar un producto al carrito de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función addProductCart del servicio de productos (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  addProductCart(ID_Producto_FK: number) {
    try {
      if (!this.authService.isAuthenticated()) {
        return this.customAlertService.sweetAlertPersonalizada('error', "Sin autenticación", "Para agregar un producto al carrito primero debes de iniciar sesión.");
      }
      
      const body = { ID_Producto_FK, Cantidad_Producto: 1 };
      this.shoppingCartService.addProductCart(`${apiURL}/usuario/carrito/agregar`, body).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getProducts();
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Error", error.error.error);
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
