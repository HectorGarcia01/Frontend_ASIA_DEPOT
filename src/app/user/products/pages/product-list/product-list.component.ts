import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/user/services/product.service';
import { Product, Products } from 'src/app/user/interfaces/product.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  product: Product[] = [];
  prducts: Products[] = [];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  /**
   * Función para consumir servicio de listar todos los productos
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProducts del servicio de productos (product.service)
   */

  getProducts() {
    this.productService.getProducts(`${apiURL}/usuario/ver/productos`).subscribe((data: any) => {
      this.product = data.products;
    });
  }
}
