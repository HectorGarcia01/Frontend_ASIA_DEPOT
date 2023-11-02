import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/user/services/product.service';
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
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getFavoriteProducts();
  }

  /**
   * Función para consumir servicio de listar todos los productos favoritos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getFavoriteProducts del servicio de productos (product.service)
   */

  getFavoriteProducts() {
    this.productService.getFavoriteProducts(`${apiURL}/usuario/ver/productos/favorito`).subscribe({
      next: (data: any) => {
        this.product = data.favoriteProduct;
        console.log(this.product);
        this.noneProducts = true;
      },
      error: (error: any) => {
        this.noneProducts = false;
      }
    });
  }
}
