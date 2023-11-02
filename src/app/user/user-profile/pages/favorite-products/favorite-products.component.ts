import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/user/services/product.service';
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
    private productService: ProductService,
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
}
