import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/user/services/product.service';
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
  category: Category[] = [];
  product: Product[] = [];
  prducts: Products[] = [];
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 8;
  msgError: string = '';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit() {
    this.scrollToTop();
    this.getCategories();
    this.getProducts();
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
   * Función para consumir servicio de listar todos los productos por categoría
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProducts del servicio de productos (product.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  getProductsCategory(categoria: number) {
    try {
      this.productService.getProducts(`${apiURL}/usuario/ver/productos?estado=Activo&categoria=${categoria}`, this.currentPage, this.pageSize).subscribe({
        next: (data: any) => {
          this.product = data.products;
          this.totalPages = data.totalPages;
          this.currentPage = data.currentPage;
          this.msgError = '';
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

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
