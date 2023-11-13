import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductService } from 'src/app/user/services/product.service';
import { ShoppingCartService } from 'src/app/user/services/shopping-cart.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { Product, Products } from 'src/app/user/interfaces/product.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-products-section',
  templateUrl: './products-section.component.html',
  styleUrls: ['./products-section.component.css']
})
export class ProductsSectionComponent {
  product: Product[] = [];
  prducts: Products[] = [];
  noneProducts: boolean = false;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  /**
   * Función para consumir el servicio de de listar productos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getProducts del servicio de producto (product.service)
   */

  getProducts() {
    this.productService.getProducts(`${apiURL}/usuario/ver/productos?estado=Activo`).subscribe({
      next: (data: any) => {
        this.product = data.products;

        this.product = this.product.filter((FeaturedProducts: Product) => {
          return FeaturedProducts.Producto_Destacado === true;
        });

        if (this.product.length === 0) {
          this.noneProducts = false;
        } else {
          this.noneProducts = true;
        }
      },
      error: (error: any) => {
        this.product = [];
        this.noneProducts = false;
      }
    });
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
}
