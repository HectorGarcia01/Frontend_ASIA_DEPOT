import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/user/services/product.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ShoppingCartService } from 'src/app/user/services/shopping-cart.service';
import { ReviewsService } from 'src/app/user/services/reviews.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { Product } from 'src/app/user/interfaces/product.interface';
import { Category } from 'src/app/user/interfaces/category.interface';
import { apiURL } from 'src/app/config/config';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product = {} as Product;
  category: Category = {} as Category;
  increment: number = 1;
  productReviews: any = [];
  countReviews: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService: AuthService,
    private reviewsService: ReviewsService,
    private shoppingCartService: ShoppingCartService,
    private customAlertService: CustomAlertService
  ) { }

  ngOnInit() {
    this.scrollToTop();
    this.getParamsId();
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
      const IdProduct = params.get('id');

      if (IdProduct) {
        this.getProductId(IdProduct);
        this.getReviews(IdProduct);
      }
    });
  }

  /**
   * Función para consumir servicio de obtener un producto por Id
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función getProductId del servicio de productos (product.service)
   */

  getProductId(IdProduct: string) {
    this.productService.getProductId(`${apiURL}/usuario/ver/producto/${IdProduct}`).subscribe((data: any) => {
      this.product = data.product;
      this.category = data.product.categoria;
    });
  }

  /**
   * Función para consumir servicio para agregar un producto al carrito de compras
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias:
   *            Función addProductCart del servicio de productos (shopping-cart.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)
   */

  onSubmit(ID_Producto_FK: number) {
    try {
      if (!this.authService.isAuthenticated()) {
        return this.customAlertService.sweetAlertPersonalizada('error', "Sin autenticación", "Para agregar un producto al carrito primero debes de iniciar sesión.");
      }

      const body = { ID_Producto_FK, Cantidad_Producto: this.increment };
      this.shoppingCartService.addProductCart(`${apiURL}/usuario/carrito/agregar`, body).subscribe({
        next: (data: any) => {
          this.customAlertService.sweetAlertPersonalizada('success', "Exitoso", data.msg);
          this.getParamsId();
          this.increment = 1;
        },
        error: (error: any) => {
          this.customAlertService.sweetAlertPersonalizada('error', "Lo siento", `No hay sufiente stock de "${this.product.Nombre_Producto}"`);
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }

  /**
   * Función para consumir el servicio de ver reseñas
   * Fecha creación: 06/10/2023
   * Autor: Hector Armando García González
   * Referencias: 
   *            Función getCustomerProfile del servicio de usuarios (user-services.service),
   *            Función sweetAlertPersonalizada del servicio de alerta personalizada (custom-alert.service)  
   */

  getReviews(id: any) {
    try {
      this.reviewsService.getReviews(`${apiURL}/usuario/ver/todas/valoraciones/producto`, id).subscribe({
        next: (data: any) => {
          this.productReviews = data.productReviews;
          this.countReviews = this.productReviews.length;
        },
        error: (error: any) => {
          console.log(error.error.error);
        }
      });
    } catch (error: any) {
      console.log(error.error);
    }
  }

  decreaseQuantity() {
    if (this.increment > 1) {
      this.increment--;
    }
  }

  increaseQuantity() {
    if (this.increment < this.product.Cantidad_Stock) {
      this.increment++;
    } else {
      this.customAlertService.sweetAlertPersonalizada('error', "Lo siento", `No hay sufiente stock de "${this.product.Nombre_Producto}"`);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
