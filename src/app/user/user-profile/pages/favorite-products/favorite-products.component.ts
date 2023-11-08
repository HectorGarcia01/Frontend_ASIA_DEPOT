import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProductService } from 'src/app/user/services/product.service';
import { ShoppingCartService } from 'src/app/user/services/shopping-cart.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { FavoriteProduct } from 'src/app/user/interfaces/product.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-favorite-products',
  templateUrl: './favorite-products.component.html',
  styleUrls: ['./favorite-products.component.css']
})
export class FavoriteProductsComponent implements OnInit {
  product: FavoriteProduct[] = [];
  noneProducts: boolean = false;

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit() {
    this.getFavoriteProducts();
  }

  /**
   * Función para consumir servicio de listar todos los productos favoritos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getFavoriteProducts del servicio de productos (product.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  getFavoriteProducts() {
    if (!this.authService.isAuthenticated()) {
      return this.customAlertService.sweetAlertPersonalizada('error', "Sin autenticación", "Para obtener los products favoritos primero debes de iniciar sesión.");
    }

    this.productService.getFavoriteProducts(`${apiURL}/usuario/ver/productos/favorito`).subscribe({
      next: (data: any) => {
        this.product = data.favoriteProduct;

        this.product = this.product.filter((favoriteProduct: FavoriteProduct) => {
          return favoriteProduct.producto.estado.Tipo_Estado === 'Activo';
        });
        
        this.noneProducts = true;
      },
      error: (error: any) => {
        this.product = [];
        this.noneProducts = false;
      }
    });
  }

  /**
   * Función para consumir servicio para eliminar un producto de favoritos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función addFavoriteProduct del servicio de productos (product.service)
   */

  deleteFavoriteProduct(id: number) {
    try {
      if (!this.authService.isAuthenticated()) {
        return this.customAlertService.sweetAlertPersonalizada('error', "Sin autenticación", "Para eliminar un producto de favoritos primero debes de iniciar sesión.");
      }

      this.productService.deleteFavoriteProduct(`${apiURL}/usuario/eliminar/producto/favorito`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getFavoriteProducts();
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
          this.getFavoriteProducts();
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
