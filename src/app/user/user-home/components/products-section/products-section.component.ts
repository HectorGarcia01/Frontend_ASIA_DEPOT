import { Component } from '@angular/core';
import { ProductService } from 'src/app/user/services/product.service';
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

  constructor(
    private productService: ProductService,
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
    this.productService.getProducts(`${apiURL}/usuario/ver/productos?estado=Activo`).subscribe((data: any) => {
      this.product = data.products;
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
      this.productService.addFavoriteProduct(`${apiURL}/usuario/agregar/producto/favorito`, id).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
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
